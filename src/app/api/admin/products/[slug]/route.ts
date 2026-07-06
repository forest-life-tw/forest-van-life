import { NextResponse } from "next/server";
import { ghRead, ghWrite, ghDelete } from "@/lib/github";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { slug } = await params;
  const file = await ghRead("content/site-config.json");
  if (!file) return NextResponse.json({ error: "config not found" }, { status: 500 });
  const config = JSON.parse(file.content);
  const product = config.products.find((p: { slug: string }) => p.slug === slug);
  if (!product) return NextResponse.json({ error: "not found" }, { status: 404 });

  const contentFile = await ghRead(`content/products/${slug}.md`);
  return NextResponse.json({
    ...product,
    content: contentFile?.content ?? "",
  });
}

export async function PUT(req: Request, { params }: Params) {
  const { slug } = await params;
  const { content, ...updated } = await req.json();

  const file = await ghRead("content/site-config.json");
  if (!file) return NextResponse.json({ error: "config not found" }, { status: 500 });
  const config = JSON.parse(file.content);

  config.products = config.products.map((p: { slug: string }) =>
    p.slug === slug ? { ...p, ...updated, slug } : p
  );

  const ok = await ghWrite(
    "content/site-config.json",
    JSON.stringify(config, null, 2),
    `更新配件：${slug}`,
    file.sha
  );
  if (!ok) return NextResponse.json({ error: "failed" }, { status: 500 });

  if (content !== undefined) {
    const existingContent = await ghRead(`content/products/${slug}.md`);
    await ghWrite(
      `content/products/${slug}.md`,
      content,
      `更新配件內容：${slug}`,
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
  const exists = config.products.some((p: { slug: string }) => p.slug === slug);
  if (!exists) return NextResponse.json({ error: "not found" }, { status: 404 });

  config.products = config.products.filter((p: { slug: string }) => p.slug !== slug);
  const ok = await ghWrite(
    "content/site-config.json",
    JSON.stringify(config, null, 2),
    `刪除配件：${slug}`,
    file.sha
  );
  if (!ok) return NextResponse.json({ error: "failed" }, { status: 500 });

  const mdFile = await ghRead(`content/products/${slug}.md`);
  if (mdFile) {
    await ghDelete(`content/products/${slug}.md`, mdFile.sha, `刪除配件內容：${slug}`);
  }

  return NextResponse.json({ ok: true });
}
