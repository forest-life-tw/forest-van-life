import Link from "next/link";
import { notFound } from "next/navigation";

const CARS: Record<
  string,
  { name: string; note: string; desc: string; status: string }
> = {
  staria: {
    name: "Hyundai Staria",
    note: "貨車版 / Camper",
    desc: "韓系新世代廂車，2025/9 起貨車版預售 130 萬，原廠 Camper 162.8 萬起。",
    status: "施工內容整理中",
  },
  hiace: {
    name: "Toyota Hiace",
    note: "經典商用底盤",
    desc: "全球最受信賴的商用底盤之一，適合長途車宿與重度改裝。",
    status: "施工內容整理中",
  },
  combo: {
    name: "Opel Combo",
    note: "歐系小型廂車",
    desc: "歐系設計、車身緊湊，適合都會輕度車宿。",
    status: "施工內容整理中",
  },
  caddy: {
    name: "VW Caddy",
    note: "德系緊湊",
    desc: "VW 集團商用底盤，內裝改裝彈性高。",
    status: "施工內容整理中",
  },
  "j-space": {
    name: "CMC J-Space",
    note: "國產輕商用",
    desc: "中華汽車 2024 推出，輕商用露營化主力車型。",
    status: "施工內容整理中",
  },
};

export async function generateStaticParams() {
  return Object.keys(CARS).map((slug) => ({ slug }));
}

export async function generateMetadata(props: PageProps<"/cars/[slug]">) {
  const { slug } = await props.params;
  const car = CARS[slug];
  if (!car) return { title: "找不到車型" };
  return { title: `${car.name} 改裝指南`, description: car.desc };
}

export default async function CarPage(props: PageProps<"/cars/[slug]">) {
  const { slug } = await props.params;
  const car = CARS[slug];
  if (!car) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
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
            <p className="text-xs uppercase tracking-wider text-stone-500">
              {car.note}
            </p>
            <h1 className="text-3xl font-bold text-stone-900 md:text-4xl">
              {car.name}
            </h1>
          </div>
        </div>
        <p className="mt-3 text-stone-600">{car.desc}</p>
      </header>

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-stone-900">這台車能怎麼改</h2>
        <p className="text-stone-600">
          [此頁將整理：適合的改裝項目、合法路線（貨車變更 vs A 類審驗）、
          典型方案組合、實際施工照、預估工時與費用區間。]
        </p>
        <p className="mt-4 inline-block rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">
          {car.status}
        </p>
      </section>

      <aside className="rounded-xl border border-emerald-200 bg-emerald-50 p-6">
        <h3 className="mb-2 text-lg font-semibold text-emerald-900">
          想了解這台車的改裝方案？
        </h3>
        <p className="mb-4 text-sm text-emerald-800">
          告訴我們你的需求（座位數、長期使用情境、預算範圍），我們會給你一份對應的改裝建議。
        </p>
        <Link
          href="/about#contact"
          className="inline-block rounded-lg bg-emerald-700 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-800"
        >
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
