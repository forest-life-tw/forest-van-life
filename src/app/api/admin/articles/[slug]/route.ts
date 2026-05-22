import { NextResponse } from "next/server";
import { ghRead, ghWrite, ghDelete } from "@/lib/github";
import matter from "gray-matter";

type Params = { params: Promise<{ slug: string }> };

export async function GET(req: Request, { params }: Params) {
  const { slug } = await params;
  const url = new URL(req.url);
  const cat = url.searchParams.get("cat") ?? "laws";
  const file = await ghRead(`content/${cat}/${slug}.md`);
  if (!file) return NextResponse.json({ error: "not found" }, { status: 404 });
  const { data, content } = matter(file.content);
  return NextResponse.json({ ...data, content: content.trim() });
}

export async function PUT(req: Request, { params }: Params) {
  const { slug } = await params;
  const data = await req.json();
  const cat = data.category ?? "laws";
  const oldCat = data.oldCategory ?? cat;
  const path = `content/${cat}/${slug}.md`;

  const existing = await ghRead(path);
  const tags = data.tags
    ? data.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
    : [];

  const frontmatter = [
    "---",
    `title: "${data.title.replace(/"/g, '\\"')}"`,
    data.description ? `description: "${data.description.replace(/"/g, '\\"')}"` : null,
    data.light ? `light: ${data.light}` : null,
    tags.length ? `tags: [${tags.map((t: string) => `"${t}"`).join(", ")}]` : null,
    data.updated ? `updated: "${data.updated}"` : null,
    "---",
  ].filter(Boolean).join("\n");

  const content = `${frontmatter}\n\n${data.content}`;
  const ok = await ghWrite(path, content, `更新文章：${data.title}`, existing?.sha);
  if (!ok) return NextResponse.json({ error: "failed" }, { status: 500 });

  if (oldCat !== cat) {
    const oldFile = await ghRead(`content/${oldCat}/${slug}.md`);
    if (oldFile) await ghDelete(`content/${oldCat}/${slug}.md`, oldFile.sha, `移動文章：${slug}`);
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request, { params }: Params) {
  const { slug } = await params;
  const url = new URL(req.url);
  const cat = url.searchParams.get("cat") ?? "laws";
  const file = await ghRead(`content/${cat}/${slug}.md`);
  if (!file) return NextResponse.json({ error: "not found" }, { status: 404 });
  const ok = await ghDelete(`content/${cat}/${slug}.md`, file.sha, `刪除文章：${slug}`);
  if (!ok) return NextResponse.json({ error: "failed" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
