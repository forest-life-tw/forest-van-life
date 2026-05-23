import Image from "next/image";
import { getNewsItems, getYoutubeThumbnail } from "@/lib/news";
import type { NewsType } from "@/lib/news";

const TYPE_CONFIG: Record<NewsType, { label: string; cls: string }> = {
  youtube: { label: "YouTube", cls: "bg-rose-100 text-rose-700" },
  "fb-group": { label: "FB 社團", cls: "bg-blue-100 text-blue-700" },
  "fb-page": { label: "FB 粉專", cls: "bg-blue-100 text-blue-700" },
  manufacturer: { label: "車廠", cls: "bg-stone-100 text-stone-600" },
};

export const metadata = {
  title: "露營大小事 | 森活家露營車",
  description: "露營界值得關注的貼文、影片與產業動態，由森活家策展整理。",
};

export default function NewsPage() {
  const items = getNewsItems();

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <header className="mb-10">
        <p className="mb-2 text-sm font-medium uppercase tracking-wider text-emerald-700">
          News
        </p>
        <h1 className="text-4xl font-bold text-stone-900">露營大小事</h1>
        <p className="mt-2 text-stone-500">
          FB 社團精選、車廠動態、YouTube 影片，露營圈值得看的內容都在這裡
        </p>
      </header>

      {items.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-stone-400">目前尚無內容，敬請期待</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const cfg = TYPE_CONFIG[item.type];
            const ytThumb =
              item.type === "youtube" ? getYoutubeThumbnail(item.url) : null;

            return (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-white transition-shadow hover:shadow-md"
              >
                {ytThumb && (
                  <div className="relative aspect-video w-full overflow-hidden bg-stone-100">
                    <Image
                      src={ytThumb}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      unoptimized
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-medium ${cfg.cls}`}
                    >
                      {cfg.label}
                    </span>
                    <span className="truncate text-xs text-stone-500">
                      {item.sourceName}
                    </span>
                  </div>
                  <p className="flex-1 text-sm font-medium leading-snug text-stone-900 group-hover:text-emerald-700 line-clamp-3">
                    {item.title}
                  </p>
                  {item.note && (
                    <p className="mt-2 text-xs text-stone-400 line-clamp-1">{item.note}</p>
                  )}
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-stone-400">{item.date}</span>
                    <span className="text-xs font-medium text-emerald-700 group-hover:text-emerald-800">
                      查看原文 →
                    </span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
