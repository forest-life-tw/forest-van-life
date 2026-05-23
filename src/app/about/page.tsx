import Link from "next/link";

export const metadata = {
  title: "關於我們",
  description: "合法廂車改裝專業廠：以法規為核心、以驗車過關為標準。",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <header className="mb-10">
        <p className="mb-2 text-sm font-medium uppercase tracking-wider text-emerald-700">
          About
        </p>
        <h1 className="text-4xl font-bold text-stone-900">關於我們</h1>
      </header>

      <section className="mb-10 space-y-4 text-lg leading-relaxed text-stone-700">
        <p>
          我們是專注「合法」的廂車改裝廠。在台灣露營車產業約有七成屬於非法改裝的現況下，
          我們堅持每一項施作都對應到具體的道路交通安全規則條文，並協助客戶完成監理站變更登記。
        </p>
        <p>
          這代表客戶選擇我們時，得到的不只是改裝後的車輛，而是一份「驗車過得了、保險續得到、二手轉售有紀錄」的完整資產。
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-stone-900">主力車型</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {["Hyundai Staria", "Toyota Hiace", "Opel Combo", "VW Caddy", "CMC J-Space", "其他 Van 客製"].map((c) => (
            <div key={c} className="rounded-lg border border-stone-200 bg-stone-50 p-3 text-center text-sm font-medium text-stone-700">
              {c}
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-stone-900">主要服務</h2>
        <ul className="space-y-2 text-stone-700">
          <li>✦ 座位數變更（含合格保修廠安全帶安裝、監理站變更）</li>
          <li>✦ 車頂置物架、車頂帳合法施作</li>
          <li>✦ 內部床椅、木作、收納模組</li>
          <li>✦ 副電池、逆變器、太陽能系統</li>
          <li>✦ 駐車冷氣（公路總局已釋疑為合法可裝項目）</li>
        </ul>
      </section>

      <section
        id="contact"
        className="scroll-mt-24 rounded-2xl border border-emerald-200 bg-emerald-50 p-8"
      >
        <h2 className="mb-4 text-2xl font-bold text-emerald-900">預約諮詢</h2>
        <p className="mb-6 text-emerald-800">
          告訴我們以下資訊，我們會在 1-2 個工作天內回覆你：
        </p>
        <ul className="mb-6 space-y-1 text-sm text-emerald-900">
          <li>1. 你的車型（年份、原廠規格）</li>
          <li>2. 預計改裝項目（座位變更／車內模組／電氣系統等）</li>
          <li>3. 期望使用場景（週末車宿／長途旅行／日常通勤兼用）</li>
          <li>4. 預算區間（讓我們提出對應方案）</li>
        </ul>

        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href="https://line.me/R/ti/p/@137ktawk?oat_content=url"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-700 px-5 py-3 font-medium text-white transition-colors hover:bg-emerald-800"
          >
            💬 LINE 諮詢
          </a>
        </div>

        <p className="mt-6 text-xs text-emerald-700">
          地址：台南市永康區中山南路218號　／　營業時間：[待填]
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
