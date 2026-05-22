import { NextResponse } from "next/server";
import { ghWrite } from "@/lib/github";

function buildFrontmatter(data: Record<string, string>): string {
  const tags = data.tags
    ? data.tags.split(",").map((t) => t.trim()).filter(Boolean)
    : [];
  const lines = [
    "---",
    `title: "${data.title.replace(/"/g, '\\"')}"`,
    data.description ? `description: "${data.description.replace(/"/g, '\\"')}"` : null,
    data.light ? `light: ${data.light}` : null,
    tags.length ? `tags: [${tags.map((t) => `"${t}"`).join(", ")}]` : null,
    data.updated ? `updated: "${data.updated}"` : null,
    "---",
  ].filter(Boolean);
  return lines.join("\n");
}

export async function POST(req: Request) {
  const data = await req.json();
  const slug = data.title
    .toLowerCase()
    .replace(/[^a-z0-9一-鿿]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);

  const category = data.category ?? "laws";
  const path = `content/${category}/${slug}.md`;
  const fileContent = `${buildFrontmatter(data)}\n\n${data.content}`;

  const ok = await ghWrite(path, fileContent, `新增文章：${data.title}`);
  if (!ok) return NextResponse.json({ error: "failed" }, { status: 500 });
  return NextResponse.json({ slug });
}
