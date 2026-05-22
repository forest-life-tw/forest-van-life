import Link from "next/link";

export const metadata = {
  title: "車型專區",
  description: "我們擅長改裝的車型：Hyundai Staria、Toyota Hiace、Opel Combo、VW Caddy、CMC J-Space。",
};

const CARS = [
  {
    slug: "staria",
    name: "Hyundai Staria",
    note: "貨車版 / Camper",
    desc: "韓系新世代廂車，2025/9 起貨車版預售 130 萬，原廠 Camper 162.8 萬起。空間、動力、配備皆優於同級。",
  },
  {
    slug: "hiace",
    name: "Toyota Hiace",
    note: "經典商用底盤",
    desc: "全球最受信賴的商用底盤之一，零件好取得、底盤剛性佳，適合長途車宿與重度改裝。",
  },
  {
    slug: "combo",
    name: "Opel Combo",
    note: "歐系小型廂車",
    desc: "歐系設計，車身緊湊好停，適合都會輕度車宿或週末出遊。",
  },
  {
    slug: "caddy",
    name: "VW Caddy",
    note: "德系緊湊",
    desc: "VW 集團商用底盤，做工細緻、駕馭舒適，內裝改裝彈性高。",
  },
  {
    slug: "j-space",
    name: "CMC J-Space",
    note: "國產輕商用",
    desc: "中華汽車 2024 推出，2025 年銷量近 1.7 萬輛，是台灣輕商用露營化的主力車型，價格親民。",
  },
];

export default function CarsPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <header className="mb-12 border-b border-stone-200 pb-8">
        <p className="mb-2 text-sm font-medium uppercase tracking-wider text-emerald-700">
          車型專區
        </p>
        <h1 className="text-4xl font-bold text-stone-900">我們改的車</h1>
        <p className="mt-3 max-w-2xl text-stone-600">
          每台車的底盤剛性、空間配置、原廠座位數都不同，合法改裝路線也不一樣。
          選擇你的車型，看我們的改裝建議與法規對應。
        </p>
      </header>

      <div className="grid gap-5 md:grid-cols-2">
        {CARS.map((car) => (
          <Link
            key={car.slug}
            href={`/cars/${car.slug}`}
            className="group rounded-xl border border-stone-200 bg-white p-6 transition-all hover:border-emerald-500 hover:shadow-md"
          >
            <div className="mb-3 flex items-center gap-3">
              <span className="text-3xl">🚐</span>
              <div>
                <h2 className="text-lg font-semibold text-stone-900 group-hover:text-emerald-700">
                  {car.name}
                </h2>
                <p className="text-xs text-stone-500">{car.note}</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-stone-600">{car.desc}</p>
            <p className="mt-4 text-sm font-medium text-emerald-700">
              查看改裝建議 →
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
