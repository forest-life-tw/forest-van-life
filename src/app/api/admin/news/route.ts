import { NextResponse } from "next/server";
import { ghRead, ghWrite } from "@/lib/github";

const NEWS_PATH = "content/news.json";

export async function GET() {
  const file = await ghRead(NEWS_PATH);
  if (!file) return NextResponse.json({ items: [] });
  try {
    return NextResponse.json(JSON.parse(file.content));
  } catch {
    return NextResponse.json({ items: [] });
  }
}

export async function POST(req: Request) {
  const { title, url, type, sourceName, date, note } = await req.json();
  if (!title || !url || !type || !sourceName || !date) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }

  const file = await ghRead(NEWS_PATH);
  const existing = file ? JSON.parse(file.content) : { items: [] };
  const items: unknown[] = Array.isArray(existing.items) ? existing.items : [];

  const newItem = {
    id: Date.now().toString(),
    title: title.trim(),
    url: url.trim(),
    type,
    sourceName: sourceName.trim(),
    date,
    note: (note ?? "").trim(),
  };
  items.unshift(newItem);

  const ok = await ghWrite(
    NEWS_PATH,
    JSON.stringify({ items }, null, 2),
    `新增露營大小事：${title}`,
    file?.sha,
  );
  if (!ok) return NextResponse.json({ error: "failed" }, { status: 500 });
  return NextResponse.json({ ok: true, item: newItem });
}
