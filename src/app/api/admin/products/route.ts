import { NextResponse } from "next/server";
import { ghRead, ghWrite } from "@/lib/github";

export async function GET() {
  const file = await ghRead("content/site-config.json");
  if (!file) return NextResponse.json({ error: "not found" }, { status: 500 });
  const config = JSON.parse(file.content);
  return NextResponse.json(config.products ?? []);
}

export async function POST(req: Request) {
  const { slug, name, category, note } = await req.json();
  if (!slug || !name) return NextResponse.json({ error: "slug and name required" }, { status: 400 });

  const file = await ghRead("content/site-config.json");
  if (!file) return NextResponse.json({ error: "config not found" }, { status: 500 });
  const config = JSON.parse(file.content);

  if (config.products.find((p: { slug: string }) => p.slug === slug)) {
    return NextResponse.json({ error: "slug already exists" }, { status: 409 });
  }

  config.products.push({ slug, name, category: category ?? "", note: note ?? "", images: [] });

  const ok = await ghWrite(
    "content/site-config.json",
    JSON.stringify(config, null, 2),
    `新增配件：${name}`,
    file.sha
  );
  if (!ok) return NextResponse.json({ error: "failed" }, { status: 500 });
  return NextResponse.json({ slug });
}
