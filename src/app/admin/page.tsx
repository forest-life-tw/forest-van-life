import Link from "next/link";
import { listDocs } from "@/lib/markdown";
import siteConfig from "../../../content/site-config.json";

export default function AdminDashboard() {
  const laws = listDocs("laws");
  const design = listDocs("design");
  const others = listDocs("others");
  const totalArticles = laws.length + design.length + others.length;
  const totalCars = siteConfig.cars.length;

  const CARDS = [
    { label: "文章總數", value: totalArticles, href: "/admin/articles", color: "bg-emerald-50 text-emerald-700" },
    { label: "車型數量", value: totalCars, href: "/admin/cars", color: "bg-amber-50 text-amber-700" },
  ];

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-stone-900">後台總覽</h1>
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {CARDS.map((c) => (
          <Link key={c.label} href={c.href} className="rounded-xl border border-stone-200 bg-white p-5 transition-shadow hover:shadow-md">
            <p className="text-sm text-stone-500">{c.label}</p>
            <p className={`mt-1 text-3xl font-bold ${c.color}`}>{c.value}</p>
          </Link>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/admin/articles/new" className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white p-5 transition-shadow hover:shadow-md">
          <span className="text-2xl">✎</span>
          <div>
            <p className="font-medium text-stone-900">新增文章</p>
            <p className="text-sm text-stone-500">新增常見問題文章</p>
          </div>
        </Link>
        <Link href="/admin/settings" className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white p-5 transition-shadow hover:shadow-md">
          <span className="text-2xl">⚙</span>
          <div>
            <p className="font-medium text-stone-900">網站設定</p>
            <p className="text-sm text-stone-500">聯絡資訊、首頁文字</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
