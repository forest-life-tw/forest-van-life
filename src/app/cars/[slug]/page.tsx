import Link from "next/link";
import { notFound } from "next/navigation";
import siteConfig from "../../../../content/site-config.json";
import CarGallery from "@/components/CarGallery";

type Car = (typeof siteConfig.cars)[number];

function getCar(slug: string): Car | undefined {
  return siteConfig.cars.find((c) => c.slug === slug);
}

export async function generateStaticParams() {
  return siteConfig.cars.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(props: PageProps<"/cars/[slug]">) {
  const { slug } = await props.params;
  const car = getCar(slug);
  if (!car) return { title: "找不到車型" };
  return { title: `${car.name} 改裝指南`, description: car.note };
}

export default async function CarPage(props: PageProps<"/cars/[slug]">) {
  const { slug } = await props.params;
  const car = getCar(slug);
  if (!car) notFound();

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <nav className="mb-6 text-sm text-stone-500">
        <Link href="/" className="hover:text-emerald-700">首頁</Link>
        <span className="mx-2">/</span>
        <Link href="/cars" className="hover:text-emerald-700">車型專區</Link>
        <span className="mx-2">/</span>
        <span className="text-stone-700">{car.name}</span>
      </nav>

      <header className="mb-8 border-b border-stone-200 pb-6">
        <div className="mb-2 flex items-center gap-3">
          <span className="text-4xl">🚐</span>
          <div>
            <p className="text-xs uppercase tracking-wider text-stone-500">{car.note}</p>
            <h1 className="text-3xl font-bold text-stone-900 md:text-4xl">{car.name}</h1>
          </div>
        </div>
        {car.description && (
          <p className="mt-3 text-stone-600">{car.description}</p>
        )}
      </header>

      {/* Image Gallery */}
      {car.images.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-4 text-xl font-semibold text-stone-900">改裝實績</h2>
          <CarGallery images={car.images} carName={car.name} />
        </section>
      )}

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-stone-900">這台車能怎麼改</h2>
        <p className="text-stone-600">
          [此頁將整理：適合的改裝項目、合法路線（貨車變更 vs A 類審驗）、
          典型方案組合、實際施工照、預估工時與費用區間。]
        </p>
        <p className="mt-4 inline-block rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">
          施工內容整理中
        </p>
      </section>

      <aside className="rounded-xl border border-emerald-200 bg-emerald-50 p-6">
        <h3 className="mb-2 text-lg font-semibold text-emerald-900">想了解這台車的改裝方案？</h3>
        <p className="mb-4 text-sm text-emerald-800">
          告訴我們你的需求（座位數、長期使用情境、預算範圍），我們會給你一份對應的改裝建議。
        </p>
        <Link href="/about#contact"
          className="inline-block rounded-lg bg-emerald-700 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-800">
          預約諮詢 →
        </Link>
      </aside>

      <div className="mt-8">
        <Link href="/cars" className="text-sm text-emerald-700 hover:text-emerald-800">
          ← 回到車型專區
        </Link>
      </div>
    </div>
  );
}
