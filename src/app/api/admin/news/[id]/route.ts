import { NextResponse } from "next/server";
import { ghRead, ghWrite } from "@/lib/github";

const NEWS_PATH = "content/news.json";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const file = await ghRead(NEWS_PATH);
  if (!file) return NextResponse.json({ error: "not found" }, { status: 404 });

  const data = JSON.parse(file.content);
  const items = (data.items ?? []).filter(
    (item: { id: string }) => item.id !== id,
  );

  const ok = await ghWrite(
    NEWS_PATH,
    JSON.stringify({ items }, null, 2),
    "刪除露營大小事",
    file.sha,
  );
  if (!ok) return NextResponse.json({ error: "failed" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
