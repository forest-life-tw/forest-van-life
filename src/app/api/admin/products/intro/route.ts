import { NextResponse } from "next/server";
import { ghRead, ghWrite } from "@/lib/github";

export async function GET() {
  const file = await ghRead("content/site-config.json");
  if (!file) return NextResponse.json({ error: "not found" }, { status: 500 });
  const config = JSON.parse(file.content);
  return NextResponse.json(
    config.productsPage ?? { eyebrow: "", title: "", subtitle: "" }
  );
}

export async function PUT(req: Request) {
  const productsPage = await req.json();

  const file = await ghRead("content/site-config.json");
  if (!file) return NextResponse.json({ error: "config not found" }, { status: 500 });
  const config = JSON.parse(file.content);

  config.productsPage = productsPage;

  const ok = await ghWrite(
    "content/site-config.json",
    JSON.stringify(config, null, 2),
    "更新配件頁文字",
    file.sha
  );
  if (!ok) return NextResponse.json({ error: "failed" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
