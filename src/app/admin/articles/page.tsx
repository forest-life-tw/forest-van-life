import Link from "next/link";
import { listDocs } from "@/lib/markdown";
import { getSiteConfig } from "@/lib/config";

export default async function ArticlesAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const { cat } = await searchParams;
  const config = getSiteConfig();
  const cats = config.articleCategories ?? [
    { id: "laws", label: "法規制度" },
    { id: "design", label: "構思設計" },
    { id: "others", label: "其他" },
  ];

  const byCategory: Record<string, ReturnType<typeof listDocs>> = {};
  for (const c of cats) byCategory[c.id] = listDocs(c.id);

  const all = cats.flatMap((c) =>
    (byCategory[c.id] ?? []).map((d) => ({ ...d, category: c.id }))
  );

  const activeCat = cats.find((c) => c.id === cat)?.id ?? "all";
  const filtered = activeCat === "all" ? all : all.filter((d) => d.category === activeCat);
  const catLabel = Object.fromEntries(cats.map((c) => [c.id, c.label]));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-900">文章管理</h1>
        <Link
          href="/admin/articles/new"
          className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800"
        >
          + 新增文章
        </Link>
      </div>

      {/* Category tabs */}
      <div className="flex gap-1 border-b border-stone-200">
        {/* 全部 tab */}
        {[{ id: "all", label: "全部" }, ...cats].map((c) => {
          const count = c.id === "all" ? all.length : (byCategory[c.id]?.length ?? 0);
          const isActive = activeCat === c.id;
          return (
            <Link
              key={c.id}
              href={c.id === "all" ? "/admin/articles" : `/admin/articles?cat=${c.id}`}
              className={`relative -mb-px rounded-t-lg border px-5 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "border-stone-200 border-b-white bg-white text-emerald-700"
                  : "border-transparent text-stone-500 hover:bg-stone-50 hover:text-stone-700"
              }`}
            >
              {c.label}
              <span
                className={`ml-1.5 rounded-full px-1.5 py-0.5 text-xs ${
                  isActive ? "bg-emerald-100 text-emerald-600" : "bg-stone-100 text-stone-500"
                }`}
              >
                {count}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-b-xl rounded-tr-xl border border-t-0 border-stone-200 bg-white">
        {filtered.length === 0 ? (
          <p className="p-8 text-center text-stone-400">此分類尚無文章</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-stone-200 bg-stone-50 text-left text-xs text-stone-500">
              <tr>
                <th className="px-4 py-3 font-medium">標題</th>
                <th className="px-4 py-3 font-medium">分類</th>
                <th className="px-4 py-3 font-medium">更新日期</th>
                <th className="w-20 px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((doc, i) => (
                <tr key={doc.slug} className={i > 0 ? "border-t border-stone-100" : ""}>
                  <td className="px-4 py-3 font-medium text-stone-900">{doc.title}</td>
                  <td className="px-4 py-3 text-stone-500">{catLabel[doc.category] ?? doc.category}</td>
                  <td className="px-4 py-3 text-stone-400">{doc.updated ?? "—"}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/articles/${doc.slug}?cat=${doc.category}`}
                      className="font-medium text-emerald-700 hover:text-emerald-800"
                    >
                      編輯
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
