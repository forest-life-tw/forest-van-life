import Link from "next/link";
import Image from "next/image";
import { getSiteConfig } from "@/lib/config";

export const metadata = {
  title: "改裝配件",
  description: "床墊、木作、駐車冷氣、電力系統等改裝配件項目介紹。",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const config = getSiteConfig();
  const cats = config.productCategories ?? [];
  const catLabel = Object.fromEntries(cats.map((c) => [c.id, c.label]));
  const catIcon = Object.fromEntries(cats.map((c) => [c.id, c.icon ?? "🧰"]));

  const isAll = !category || category === "all";
  const activeCategory = isAll ? "all" : (cats.find((c) => c.id === category)?.id ?? "all");

  const products = isAll
    ? config.products
    : config.products.filter((p) => p.category === activeCategory);

  const allTabs = [{ id: "all", label: "全部" }, ...cats];
  const pageCopy = config.productsPage ?? {
    eyebrow: "改裝配件",
    title: "床墊、木作、電力系統",
    subtitle: "我們常用的改裝配件與工法，點進去看實際照片與詳細介紹。",
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <header className="mb-10 border-b border-stone-200 pb-8">
        <p className="mb-2 text-sm font-medium uppercase tracking-wider text-emerald-700">
          {pageCopy.eyebrow}
        </p>
        <h1 className="text-4xl font-bold text-stone-900">{pageCopy.title}</h1>
        <p className="mt-3 max-w-2xl text-stone-600">
          {pageCopy.subtitle}
        </p>
      </header>

      {cats.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-1 border-b border-stone-200">
          {allTabs.map((t) => (
            <Link
              key={t.id}
              href={t.id === "all" ? "?" : `?category=${t.id}`}
              className={`relative -mb-px rounded-t-lg border px-5 py-2.5 text-sm font-medium transition-colors ${
                activeCategory === t.id
                  ? "border-stone-200 border-b-white bg-white text-emerald-700"
                  : "border-transparent text-stone-500 hover:bg-stone-50 hover:text-stone-700"
              }`}
            >
              {t.label}
            </Link>
          ))}
        </div>
      )}

      {products.length === 0 ? (
        <div className="rounded-xl border border-stone-200 bg-white py-20 text-center">
          <p className="text-sm text-stone-400">目前尚未有配件項目</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <Link
              key={p.slug}
              href={`/products/${p.slug}`}
              className="group overflow-hidden rounded-xl border border-stone-200 bg-white transition-all hover:border-emerald-500 hover:shadow-md"
            >
              <div className="relative aspect-video bg-stone-100">
                {p.images[0] ? (
                  <Image
                    src={p.images[0]}
                    alt={p.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-3xl">
                    {catIcon[p.category] ?? "🧰"}
                  </div>
                )}
              </div>
              <div className="p-5">
                {p.category && (
                  <p className="mb-1 text-xs text-stone-400">{catLabel[p.category] ?? p.category}</p>
                )}
                <h2 className="text-lg font-semibold text-stone-900 group-hover:text-emerald-700">
                  {p.name}
                </h2>
                {p.note && <p className="mt-1 text-sm text-stone-600">{p.note}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
