import Link from "next/link";
import { listDocs } from "@/lib/markdown";

const CAT_LABEL: Record<string, string> = {
  design: "構思設計",
  laws: "法規制度",
  others: "其他",
};

export default function ArticlesAdminPage() {
  const all = [
    ...listDocs("design").map((d) => ({ ...d, category: "design" })),
    ...listDocs("laws").map((d) => ({ ...d, category: "laws" })),
    ...listDocs("others").map((d) => ({ ...d, category: "others" })),
  ];

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

      <div className="rounded-xl border border-stone-200 bg-white overflow-hidden">
        {all.length === 0 ? (
          <p className="p-8 text-center text-stone-400">尚無文章</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-stone-200 bg-stone-50 text-left text-xs text-stone-500">
              <tr>
                <th className="px-4 py-3 font-medium">標題</th>
                <th className="px-4 py-3 font-medium">分類</th>
                <th className="px-4 py-3 font-medium">更新日期</th>
                <th className="px-4 py-3 font-medium w-20"></th>
              </tr>
            </thead>
            <tbody>
              {all.map((doc, i) => (
                <tr key={doc.slug} className={i > 0 ? "border-t border-stone-100" : ""}>
                  <td className="px-4 py-3 font-medium text-stone-900">{doc.title}</td>
                  <td className="px-4 py-3 text-stone-500">{CAT_LABEL[doc.category]}</td>
                  <td className="px-4 py-3 text-stone-400">{doc.updated ?? "—"}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/articles/${doc.slug}?cat=${doc.category}`}
                      className="text-emerald-700 hover:text-emerald-800 font-medium"
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
