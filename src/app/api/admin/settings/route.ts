import { NextResponse } from "next/server";
import { ghRead, ghWrite } from "@/lib/github";

export async function GET() {
  const file = await ghRead("content/site-config.json");
  if (!file) return NextResponse.json({ error: "not found" }, { status: 500 });
  return NextResponse.json(JSON.parse(file.content));
}

export async function PUT(req: Request) {
  const updates = await req.json();
  const file = await ghRead("content/site-config.json");
  if (!file) return NextResponse.json({ error: "not found" }, { status: 500 });
  const config = JSON.parse(file.content);
  if (updates.contact) config.contact = { ...config.contact, ...updates.contact };
  if (updates.homepage) config.homepage = { ...config.homepage, ...updates.homepage };
  if (updates.about) config.about = { ...config.about, ...updates.about };
  if (updates.logo !== undefined) config.logo = updates.logo;
  if (updates.articleTags !== undefined) config.articleTags = updates.articleTags;
  const ok = await ghWrite(
    "content/site-config.json",
    JSON.stringify(config, null, 2),
    "更新網站設定",
    file.sha
  );
  if (!ok) return NextResponse.json({ error: "failed" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
