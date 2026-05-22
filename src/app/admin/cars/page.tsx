import Link from "next/link";
import siteConfig from "../../../../content/site-config.json";

export default function CarsAdminPage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-900">車型管理</h1>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {siteConfig.cars.map((car) => (
          <Link
            key={car.slug}
            href={`/admin/cars/${car.slug}`}
            className="flex items-center gap-4 rounded-xl border border-stone-200 bg-white p-5 transition-shadow hover:shadow-md"
          >
            <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-2xl">
              🚐
            </div>
            <div className="min-w-0">
              <p className="font-medium text-stone-900 truncate">{car.name}</p>
              <p className="text-sm text-stone-500">{car.note}</p>
              <p className="mt-1 text-xs text-stone-400">{car.images.length} 張圖片</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
