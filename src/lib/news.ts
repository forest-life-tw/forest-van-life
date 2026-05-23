import fs from "node:fs";
import path from "node:path";

export type NewsType = "youtube" | "fb-group" | "fb-page" | "manufacturer";

export type NewsItem = {
  id: string;
  title: string;
  url: string;
  type: NewsType;
  sourceName: string;
  date: string;
  note?: string;
};

export function getNewsItems(): NewsItem[] {
  const file = path.join(process.cwd(), "content", "news.json");
  if (!fs.existsSync(file)) return [];
  try {
    const raw = fs.readFileSync(file, "utf8");
    const data = JSON.parse(raw);
    return Array.isArray(data.items) ? data.items : [];
  } catch {
    return [];
  }
}

export function getYoutubeThumbnail(url: string): string | null {
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/);
  if (!match) return null;
  return `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg`;
}
