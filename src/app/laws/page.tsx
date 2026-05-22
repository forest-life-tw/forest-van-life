import Link from "next/link";
import { listDocs } from "@/lib/markdown";

export const metadata = {
  title: "常見問題 Knowhow",
  description: "改裝前你需要知道的事：設計構思、法規制度、各種常見問題解答。",
};

type Tab = "design" | "laws" | "others";

const TABS: { id: Tab; label: string }[] = [
  { id: "design", label: "該怎麼構思設計" },
  { id: "laws", label: "法規制度" },
  { id: "others", label: "其他" },
];

const LIGHT_MAP = {
  green: { label: "🟢 合法", cls: "bg-emerald-100 text-emerald-700" },
  yellow: { label: "🟡 條件", cls: "bg-amber-100 text-amber-700" },
  red: { label: "🔴 風險", cls: "bg-rose-100 text-rose-700" },
} as const;

export default async function KnowhowPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const activeTab: Tab = tab === "design" || tab === "others" ? tab : "laws";
  const docs = listDocs(activeTab);

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <header className="mb-10 border-b border-stone-200 pb-8">
        <p className="mb-2 text-sm font-medium uppercase tracking-wider text-emerald-700">
          Knowhow
        </p>
        <h1 className="text-4xl font-bold text-stone-900">常見問題</h1>
        <p className="mt-2 text-stone-500">改裝前你需要知道的事</p>
      </header>

      {/* Tab bar */}
      <div className="mb-0 flex gap-1 border-b border-stone-200">
        {TABS.map((t) => (
          <Link
            key={t.id}
            href={`?tab=${t.id}`}
            className={`relative -mb-px rounded-t-lg border px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === t.id
                ? "border-stone-200 border-b-white bg-white text-emerald-700"
                : "border-transparent text-stone-500 hover:bg-stone-50 hover:text-stone-700"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {/* Bulletin board */}
      <div className="rounded-b-xl rounded-tr-xl border border-t-0 border-stone-200 bg-white overflow-hidden">
        {docs.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-stone-400 text-sm">目前尚未有文章</p>
          </div>
        ) : (
          <ul>
            {docs.map((doc, i) => {
              const light = doc.light ? LIGHT_MAP[doc.light] : null;
              return (
                <li key={doc.slug} className={i > 0 ? "border-t border-stone-100" : ""}>
                  <Link
                    href={`/laws/${doc.slug}`}
                    className="group flex items-center gap-4 px-6 py-5 transition-colors hover:bg-stone-50"
                  >
                    {light ? (
                      <span
                        className={`shrink-0 rounded px-2 py-0.5 text-xs font-medium ${light.cls}`}
                      >
                        {light.label}
                      </span>
                    ) : (
                      <span className="shrink-0 w-14" />
                    )}

                    <span className="flex-1 text-sm font-medium leading-snug text-stone-900 group-hover:text-emerald-700">
                      {doc.title}
                    </span>

                    {doc.tags && doc.tags.length > 0 && (
                      <span className="hidden sm:flex shrink-0 gap-1">
                        {doc.tags.slice(0, 2).map((t) => (
                          <span
                            key={t}
                            className="rounded bg-stone-100 px-2 py-0.5 text-xs text-stone-500"
                          >
                            {t}
                          </span>
                        ))}
                      </span>
                    )}

                    {doc.updated && (
                      <span className="shrink-0 text-xs text-stone-400">{doc.updated}</span>
                    )}

                    <span className="shrink-0 text-stone-300 transition-colors group-hover:text-emerald-500">
                      →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
