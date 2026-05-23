import { NextResponse } from "next/server";
import { ghRead, ghWrite, ghDelete } from "@/lib/github";
import { copy, del } from "@vercel/blob";

type Params = { params: Promise<{ slug: string }> };
type ImageGroup = { name: string; images: string[] };

export async function GET(_req: Request, { params }: Params) {
  const { slug } = await params;
  const file = await ghRead("content/site-config.json");
  if (!file) return NextResponse.json({ error: "config not found" }, { status: 500 });
  const config = JSON.parse(file.content);
  const car = config.cars.find((c: { slug: string }) => c.slug === slug);
  if (!car) return NextResponse.json({ error: "not found" }, { status: 404 });

  const contentFile = await ghRead(`content/cars/${slug}.md`);
  return NextResponse.json({ ...car, content: contentFile?.content ?? "" });
}

export async function PUT(req: Request, { params }: Params) {
  const { slug } = await params;
  const { content, ...updated } = await req.json();

  const file = await ghRead("content/site-config.json");
  if (!file) return NextResponse.json({ error: "config not found" }, { status: 500 });
  const config = JSON.parse(file.content);
  const oldCar = config.cars.find((c: { slug: string }) => c.slug === slug);

  // 若分類改名，同步重命名 Blob 檔案
  let newImageGroups: ImageGroup[] = updated.imageGroups ?? [];
  const oldGroups: ImageGroup[] = oldCar?.imageGroups ?? [];

  if (oldGroups.length > 0 && newImageGroups.length > 0) {
    newImageGroups = await Promise.all(
      newImageGroups.map(async (newGroup, i) => {
        const oldGroup = oldGroups[i];
        if (!oldGroup || oldGroup.name === newGroup.name) return newGroup;

        const newImages = await Promise.all(
          newGroup.images.map(async (url) => {
            try {
              const filename = url.split("/").pop() ?? "";
              const oldPrefix = `${oldGroup.name}-`;
              const newFilename = filename.startsWith(oldPrefix)
                ? `${newGroup.name}-${filename.slice(oldPrefix.length)}`
                : `${newGroup.name}-${filename}`;
              const blob = await copy(url, `cars/${slug}/${newFilename}`, { access: "public" });
              await del(url);
              return blob.url;
            } catch {
              return url;
            }
          })
        );
        return { ...newGroup, images: newImages };
      })
    );
  }

  config.cars = config.cars.map((c: { slug: string }) =>
    c.slug === slug ? { ...c, ...updated, imageGroups: newImageGroups, slug } : c
  );

  const ok = await ghWrite(
    "content/site-config.json",
    JSON.stringify(config, null, 2),
    `更新車型：${slug}`,
    file.sha
  );
  if (!ok) return NextResponse.json({ error: "failed" }, { status: 500 });

  if (content !== undefined) {
    const existingContent = await ghRead(`content/cars/${slug}.md`);
    await ghWrite(
      `content/cars/${slug}.md`,
      content,
      `更新車型內容：${slug}`,
      existingContent?.sha
    );
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: Params) {
  const { slug } = await params;

  const file = await ghRead("content/site-config.json");
  if (!file) return NextResponse.json({ error: "config not found" }, { status: 500 });
  const config = JSON.parse(file.content);
  const exists = config.cars.some((c: { slug: string }) => c.slug === slug);
  if (!exists) return NextResponse.json({ error: "not found" }, { status: 404 });

  config.cars = config.cars.filter((c: { slug: string }) => c.slug !== slug);
  const ok = await ghWrite(
    "content/site-config.json",
    JSON.stringify(config, null, 2),
    `刪除車型：${slug}`,
    file.sha
  );
  if (!ok) return NextResponse.json({ error: "failed" }, { status: 500 });

  const mdFile = await ghRead(`content/cars/${slug}.md`);
  if (mdFile) {
    await ghDelete(`content/cars/${slug}.md`, mdFile.sha, `刪除車型內容：${slug}`);
  }

  return NextResponse.json({ ok: true });
}
