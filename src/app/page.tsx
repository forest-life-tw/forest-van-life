import Link from "next/link";
import { listDocs } from "@/lib/markdown";

const FEATURES = [
  {
    title: "法規依據齊全",
    desc: "每一項改裝對應道安規則條文與監理流程，不打模糊仗。",
    icon: "📋",
  },
  {
    title: "驗車過得了",
    desc: "從設計階段就考慮驗車要求，不會做完才發現過不了。",
    icon: "✅",
  },
  {
    title: "保固與後續",
    desc: "施工有保固，未來轉售、過戶都有完整紀錄可查。",
    icon: "🔧",
  },
];

const CARS = [
  { slug: "staria", name: "Hyundai Staria", note: "貨車版 / Camper" },
  { slug: "hiace", name: "Toyota Hiace", note: "經典商用底盤" },
  { slug: "combo", name: "Opel Combo", note: "歐系小型廂車" },
  { slug: "caddy", name: "VW Caddy", note: "德系緊湊" },
  { slug: "j-space", name: "CMC J-Space", note: "國產輕商用" },
];

export default function Home() {
  const laws = listDocs("laws").slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-stone-900 text-white">
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-emerald-300">
            森活家露營車 · Forest Van Life
          </p>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight md:text-5xl">
            把車輛改成移動的家，<br />
            每一道工序都查得到法規。
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-emerald-50/90">
            專注貨車、客貨車的合法露營改裝。從座位變更、車內木作、副電池到駐車冷氣，
            我們把每項改裝對應的法源、變更登記流程、驗車要點全部整理清楚，
            讓你在動工之前就知道未來能不能上路。
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/laws"
              className="rounded-lg bg-amber-500 px-6 py-3 font-medium text-stone-900 transition-colors hover:bg-amber-400"
            >
              常見問題 Knowhow →
            </Link>
            <Link
              href="/about#contact"
              className="rounded-lg border border-white/30 px-6 py-3 font-medium text-white transition-colors hover:bg-white/10"
            >
              預約諮詢
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-stone-200 bg-white p-6 transition-shadow hover:shadow-md"
            >
              <div className="mb-3 text-3xl">{f.icon}</div>
              <h3 className="mb-2 text-lg font-semibold text-stone-900">{f.title}</h3>
              <p className="text-sm leading-relaxed text-stone-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Laws */}
      <section className="bg-stone-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="mb-2 text-sm font-medium uppercase tracking-wider text-emerald-700">
                Knowhow
              </p>
              <h2 className="text-3xl font-bold text-stone-900">最新 Knowhow</h2>
            </div>
            <Link
              href="/laws"
              className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
            >
              全部文章 →
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {laws.map((law) => (
              <Link
                key={law.slug}
                href={`/laws/${law.slug}`}
                className="group rounded-xl border border-stone-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="mb-3 flex items-center gap-2">
                  <LightBadge light={law.light} />
                  {law.tags?.slice(0, 2).map((t) => (
                    <span
                      key={t}
                      className="rounded-md bg-stone-100 px-2 py-0.5 text-xs text-stone-600"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <h3 className="mb-2 text-base font-semibold leading-tight text-stone-900 group-hover:text-emerald-700">
                  {law.title}
                </h3>
                <p className="line-clamp-3 text-sm text-stone-600">{law.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Car models */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-10">
          <p className="mb-2 text-sm font-medium uppercase tracking-wider text-emerald-700">
            車型專區
          </p>
          <h2 className="text-3xl font-bold text-stone-900">我們改的車</h2>
          <p className="mt-2 max-w-xl text-stone-600">
            主力車型涵蓋日系、韓系、歐系商用底盤，從輕商到中型 Van 皆有客製化施作經驗。
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {CARS.map((car) => (
            <Link
              key={car.slug}
              href={`/cars/${car.slug}`}
              className="group rounded-lg border border-stone-200 bg-white p-5 text-center transition-all hover:border-emerald-500 hover:shadow-md"
            >
              <div className="mb-2 text-2xl">🚐</div>
              <div className="text-sm font-semibold text-stone-900 group-hover:text-emerald-700">
                {car.name}
              </div>
              <div className="mt-1 text-xs text-stone-500">{car.note}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-emerald-900 py-16 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold">準備好把你的車改成家了嗎？</h2>
          <p className="mx-auto mt-4 max-w-xl text-emerald-100">
            告訴我們你的車型與需求，我們會給你一份完整、合法、可上路的改裝方案。
          </p>
          <Link
            href="/about#contact"
            className="mt-8 inline-block rounded-lg bg-amber-500 px-8 py-3 font-medium text-stone-900 transition-colors hover:bg-amber-400"
          >
            預約免費諮詢
          </Link>
        </div>
      </section>
    </div>
  );
}

function LightBadge({ light }: { light?: "green" | "yellow" | "red" }) {
  if (!light) return null;
  const map = {
    green: { label: "🟢 合法綠燈", cls: "bg-emerald-100 text-emerald-800" },
    yellow: { label: "🟡 條件合法", cls: "bg-amber-100 text-amber-800" },
    red: { label: "🔴 高風險", cls: "bg-rose-100 text-rose-800" },
  };
  const { label, cls } = map[light];
  return (
    <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${cls}`}>
      {label}
    </span>
  );
}
