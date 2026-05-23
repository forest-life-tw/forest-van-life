import Link from "next/link";
import { getSiteConfig } from "@/lib/config";

export const metadata = {
  title: "關於我們",
  description: "合法廂車改裝專業廠：以法規為核心、以驗車過關為標準。",
};

export default function AboutPage() {
  const config = getSiteConfig();
  const { intro, services, consultationTitle, consultationDesc, consultationSteps } = config.about;
  const { address, lineUrl, businessHours } = config.contact;

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <header className="mb-10">
        <p className="mb-2 text-sm font-medium uppercase tracking-wider text-emerald-700">
          About
        </p>
        <h1 className="text-4xl font-bold text-stone-900">關於我們</h1>
      </header>

      <section className="mb-10 space-y-4 text-lg leading-relaxed text-stone-700">
        {intro.map((p, i) => <p key={i}>{p}</p>)}
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-stone-900">主力車型</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {config.cars.map((c) => (
            <div key={c.slug} className="rounded-lg border border-stone-200 bg-stone-50 p-3 text-center text-sm font-medium text-stone-700">
              {c.name}
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-stone-900">主要服務</h2>
        <ul className="space-y-2 text-stone-700">
          {services.map((s, i) => <li key={i}>{s}</li>)}
        </ul>
      </section>

      <section
        id="contact"
        className="scroll-mt-24 rounded-2xl border border-emerald-200 bg-emerald-50 p-8"
      >
        <h2 className="mb-4 text-2xl font-bold text-emerald-900">{consultationTitle}</h2>
        <p className="mb-6 text-emerald-800">{consultationDesc}</p>
        <ul className="mb-6 space-y-1 text-sm text-emerald-900">
          {consultationSteps.map((step, i) => <li key={i}>{step}</li>)}
        </ul>

        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href={lineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-700 px-5 py-3 font-medium text-white transition-colors hover:bg-emerald-800"
          >
            💬 LINE 諮詢
          </a>
        </div>

        <p className="mt-6 text-xs text-emerald-700">
          地址：{address}
          {businessHours && <span>　／　營業時間：{businessHours}</span>}
        </p>
      </section>

      <div className="mt-10">
        <Link href="/" className="text-sm text-emerald-700 hover:text-emerald-800">
          ← 回首頁
        </Link>
      </div>
    </div>
  );
}
