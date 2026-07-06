import Link from "next/link";
import { notFound } from "next/navigation";
import { getSiteConfig } from "@/lib/config";
import { getDoc } from "@/lib/markdown";
import CarGallery from "@/components/CarGallery";

export async function generateStaticParams() {
  const config = getSiteConfig();
  return config.products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/products/[slug]">) {
  const { slug } = await props.params;
  const config = getSiteConfig();
  const product = config.products.find((p) => p.slug === slug);
  if (!product) return { title: "找不到配件" };
  return { title: `${product.name}｜改裝配件`, description: product.note };
}

export default async function ProductPage(props: PageProps<"/products/[slug]">) {
  const { slug } = await props.params;
  const config = getSiteConfig();
  const product = config.products.find((p) => p.slug === slug);
  if (!product) notFound();

  const catLabel = config.productCategories?.find((c) => c.id === product.category)?.label;
  const doc = await getDoc("products", slug);

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <nav className="mb-6 text-sm text-stone-500">
        <Link href="/" className="hover:text-emerald-700">首頁</Link>
        <span className="mx-2">/</span>
        <Link href="/products" className="hover:text-emerald-700">改裝配件</Link>
        <span className="mx-2">/</span>
        <span className="text-stone-700">{product.name}</span>
      </nav>

      <header className="mb-8 border-b border-stone-200 pb-6">
        <div className="mb-2 flex items-center gap-3">
          <span className="text-4xl">🧰</span>
          <div>
            {catLabel && <p className="text-xs uppercase tracking-wider text-stone-500">{catLabel}</p>}
            <h1 className="text-3xl font-bold text-stone-900 md:text-4xl">{product.name}</h1>
          </div>
        </div>
        {product.note && (
          <p className="mt-3 text-stone-600">{product.note}</p>
        )}
      </header>

      {product.images.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-4 text-xl font-semibold text-stone-900">實品照片</h2>
          <CarGallery images={product.images} carName={product.name} />
        </section>
      )}

      {doc?.html && (
        <section className="mb-10">
          <h2 className="mb-6 text-xl font-semibold text-stone-900">詳細介紹</h2>
          <div
            className="prose-article"
            dangerouslySetInnerHTML={{ __html: doc.html }}
          />
        </section>
      )}

      <aside className="rounded-xl border border-emerald-200 bg-emerald-50 p-6">
        <h3 className="mb-2 text-lg font-semibold text-emerald-900">想了解這項配件的安裝方案？</h3>
        <p className="mb-4 text-sm text-emerald-800">
          告訴我們你的車型與需求，我們會給你對應的安裝建議與報價。
        </p>
        <Link href="/about#contact"
          className="inline-block rounded-lg bg-emerald-700 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-800">
          預約諮詢 →
        </Link>
      </aside>

      <div className="mt-8">
        <Link href="/products" className="text-sm text-emerald-700 hover:text-emerald-800">
          ← 回到改裝配件
        </Link>
      </div>
    </div>
  );
}
