import Link from "next/link";
import { notFound } from "next/navigation";
import { getKnowhowDoc, listDocs } from "@/lib/markdown";

export async function generateStaticParams() {
  return [
    ...listDocs("laws").map((d) => ({ slug: d.slug })),
    ...listDocs("design").map((d) => ({ slug: d.slug })),
    ...listDocs("others").map((d) => ({ slug: d.slug })),
  ];
}

export async function generateMetadata(props: PageProps<"/laws/[slug]">) {
  const { slug } = await props.params;
  const result = await getKnowhowDoc(slug);
  if (!result) return { title: "找不到文章" };
  return {
    title: result.doc.title,
    description: result.doc.description,
  };
}

const LIGHT_MAP = {
  green: { label: "🟢 合法綠燈", cls: "bg-emerald-100 text-emerald-800" },
  yellow: { label: "🟡 條件合法", cls: "bg-amber-100 text-amber-800" },
  red: { label: "🔴 高風險", cls: "bg-rose-100 text-rose-800" },
} as const;

export default async function LawArticlePage(props: PageProps<"/laws/[slug]">) {
  const { slug } = await props.params;
  const result = await getKnowhowDoc(slug);
  if (!result) notFound();
  const { doc } = result;

  const light = doc.light ? LIGHT_MAP[doc.light] : null;

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <nav className="mb-6 text-sm text-stone-500">
        <Link href="/" className="hover:text-emerald-700">首頁</Link>
        <span className="mx-2">/</span>
        <Link href="/laws" className="hover:text-emerald-700">常見問題 Knowhow</Link>
        <span className="mx-2">/</span>
        <span className="text-stone-700">{doc.title}</span>
      </nav>

      <header className="mb-8 border-b border-stone-200 pb-6">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {light && (
            <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${light.cls}`}>
              {light.label}
            </span>
          )}
          {doc.tags?.map((t: string) => (
            <span
              key={t}
              className="rounded-md bg-stone-100 px-2 py-0.5 text-xs text-stone-600"
            >
              {t}
            </span>
          ))}
        </div>
        <h1 className="text-3xl font-bold leading-tight text-stone-900 md:text-4xl">
          {doc.title}
        </h1>
        {doc.description && (
          <p className="mt-3 text-stone-600">{doc.description}</p>
        )}
        {doc.updated && (
          <p className="mt-3 text-xs text-stone-400">最後更新：{doc.updated}</p>
        )}
      </header>

      <div
        className="prose-article"
        dangerouslySetInnerHTML={{ __html: doc.html }}
      />

      <aside className="mt-12 rounded-xl border border-emerald-200 bg-emerald-50 p-6">
        <h3 className="mb-2 text-lg font-semibold text-emerald-900">
          有相關改裝需求？
        </h3>
        <p className="mb-4 text-sm text-emerald-800">
          我們可以針對你的車型評估合法路線、提供完整施工方案。
        </p>
        <Link
          href="/about#contact"
          className="inline-block rounded-lg bg-emerald-700 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-800"
        >
          預約諮詢 →
        </Link>
      </aside>

      <div className="mt-8">
        <Link href="/laws" className="text-sm text-emerald-700 hover:text-emerald-800">
          ← 回到常見問題 Knowhow 列表
        </Link>
      </div>
    </article>
  );
}
