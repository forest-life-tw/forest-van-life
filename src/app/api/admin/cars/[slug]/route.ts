import { NextResponse } from "next/server";
import { ghRead, ghWrite, ghDelete } from "@/lib/github";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { slug } = await params;
  const file = await ghRead("content/site-config.json");
  if (!file) return NextResponse.json({ error: "config not found" }, { status: 500 });
  const config = JSON.parse(file.content);
  const car = config.cars.find((c: { slug: string }) => c.slug === slug);
  if (!car) return NextResponse.json({ error: "not found" }, { status: 404 });

  // 讀取車型的 markdown 內容（不存在時回傳空字串）
  const contentFile = await ghRead(`content/cars/${slug}.md`);
  return NextResponse.json({ ...car, content: contentFile?.content ?? "" });
}

export async function PUT(req: Request, { params }: Params) {
  const { slug } = await params;
  const { content, ...updated } = await req.json();

  // 更新 site-config.json 的車型資料
  const file = await ghRead("content/site-config.json");
  if (!file) return NextResponse.json({ error: "config not found" }, { status: 500 });
  const config = JSON.parse(file.content);
  config.cars = config.cars.map((c: { slug: string }) =>
    c.slug === slug ? { ...c, ...updated, slug } : c
  );
  const ok = await ghWrite(
    "content/site-config.json",
    JSON.stringify(config, null, 2),
    `更新車型：${slug}`,
    file.sha
  );
  if (!ok) return NextResponse.json({ error: "failed" }, { status: 500 });

  // 儲存車型 Markdown 內容（若有提供）
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

  // 若有車型 markdown，一併刪除
  const mdFile = await ghRead(`content/cars/${slug}.md`);
  if (mdFile) {
    await ghDelete(`content/cars/${slug}.md`, mdFile.sha, `刪除車型內容：${slug}`);
  }

  return NextResponse.json({ ok: true });
}
