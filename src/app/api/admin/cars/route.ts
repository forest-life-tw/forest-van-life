import { NextResponse } from "next/server";
import { ghRead, ghWrite } from "@/lib/github";

export async function GET() {
  const file = await ghRead("content/site-config.json");
  if (!file) return NextResponse.json({ error: "not found" }, { status: 500 });
  const config = JSON.parse(file.content);
  return NextResponse.json(config.cars ?? []);
}

export async function POST(req: Request) {
  const { slug, name, note, description } = await req.json();
  if (!slug || !name) return NextResponse.json({ error: "slug and name required" }, { status: 400 });

  const file = await ghRead("content/site-config.json");
  if (!file) return NextResponse.json({ error: "config not found" }, { status: 500 });
  const config = JSON.parse(file.content);

  if (config.cars.find((c: { slug: string }) => c.slug === slug)) {
    return NextResponse.json({ error: "slug already exists" }, { status: 409 });
  }

  config.cars.push({ slug, name, note: note ?? "", description: description ?? "", images: [] });

  const ok = await ghWrite(
    "content/site-config.json",
    JSON.stringify(config, null, 2),
    `新增車型：${name}`,
    file.sha
  );
  if (!ok) return NextResponse.json({ error: "failed" }, { status: 500 });
  return NextResponse.json({ slug });
}
