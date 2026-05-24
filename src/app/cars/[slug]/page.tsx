import Link from "next/link";
import { notFound } from "next/navigation";
import { getSiteConfig } from "@/lib/config";
import { getDoc } from "@/lib/markdown";
import CarGallery from "@/components/CarGallery";
import CarModelViewer from "@/components/CarModelViewer";

export async function generateStaticParams() {
  const config = getSiteConfig();
  return config.cars.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(props: PageProps<"/cars/[slug]">) {
  const { slug } = await props.params;
  const config = getSiteConfig();
  const car = config.cars.find((c) => c.slug === slug);
  if (!car) return { title: "找不到車型" };
  return { title: `${car.name} 改裝指南`, description: car.description || car.note };
}

export default async function CarPage(props: PageProps<"/cars/[slug]">) {
  const { slug } = await props.params;
  const config = getSiteConfig();
  const car = config.cars.find((c) => c.slug === slug);
  if (!car) notFound();

  const doc = await getDoc("cars", slug);

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
      {(car.imageGroups?.length > 0 || car.images.length > 0) && (
        <section className="mb-12">
          <h2 className="mb-4 text-xl font-semibold text-stone-900">改裝實績</h2>
          <CarGallery imageGroups={car.imageGroups} images={car.images} carName={car.name} />
        </section>
      )}

      {/* 3D 模型 */}
      {car.model3d && (
        <section className="mb-12">
          <h2 className="mb-4 text-xl font-semibold text-stone-900">3D 模型預覽</h2>
          <CarModelViewer src={car.model3d} alt={`${car.name} 3D 模型 - 森活家露營車改裝`} />
        </section>
      )}

      {/* 改裝內容（從 content/cars/[slug].md 讀取） */}
      {doc?.html && (
        <section className="mb-10">
          <h2 className="mb-6 text-xl font-semibold text-stone-900">這台車能怎麼改</h2>
          <div
            className="prose-article"
            dangerouslySetInnerHTML={{ __html: doc.html }}
          />
        </section>
      )}

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
