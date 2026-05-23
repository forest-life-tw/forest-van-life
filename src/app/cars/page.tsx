import Link from "next/link";
import { getSiteConfig } from "@/lib/config";

export const metadata = {
  title: "車型專區",
  description: "我們擅長改裝的車型：Hyundai Staria、Toyota Hiace、Opel Combo、VW Caddy、CMC J-Space。",
};

export default function CarsPage() {
  const config = getSiteConfig();
  const cars = config.cars;

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
        {cars.map((car) => (
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
            <p className="text-sm leading-relaxed text-stone-600">{car.description}</p>
            <p className="mt-4 text-sm font-medium text-emerald-700">
              查看改裝建議 →
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
