import { NextResponse } from "next/server";
import { ghRead, ghWrite } from "@/lib/github";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { slug } = await params;
  const file = await ghRead("content/site-config.json");
  if (!file) return NextResponse.json({ error: "config not found" }, { status: 500 });
  const config = JSON.parse(file.content);
  const car = config.cars.find((c: { slug: string }) => c.slug === slug);
  if (!car) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(car);
}

export async function PUT(req: Request, { params }: Params) {
  const { slug } = await params;
  const updated = await req.json();
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
  return NextResponse.json({ ok: true });
}
