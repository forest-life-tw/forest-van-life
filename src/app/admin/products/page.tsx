"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { markBuildTriggered } from "@/lib/build-signal";

type Category = { id: string; label: string; icon?: string };
type Product = { slug: string; name: string; category: string; note: string; images: string[] };

const ICONS = ["🧰", "🛏️", "🪵", "❄️", "🔋", "🔌", "🪟", "🚰", "💡", "🧯", "🌞", "🧺", "🚪", "🔧"];

export default function ProductsAdminPage() {
  const router = useRouter();

  // 列表頁文字
  const [intro, setIntro] = useState({ eyebrow: "", title: "", subtitle: "" });
  const [introLoading, setIntroLoading] = useState(true);
  const [introSaving, setIntroSaving] = useState(false);
  const [introSaved, setIntroSaved] = useState(false);

  // 分類管理
  const [cats, setCats] = useState<Category[]>([]);
  const [catsLoading, setCatsLoading] = useState(true);
  const [catsSaving, setCatsSaving] = useState(false);
  const [catsSaved, setCatsSaved] = useState(false);
  const [newCatId, setNewCatId] = useState("");
  const [newCatLabel, setNewCatLabel] = useState("");
  const [newCatIcon, setNewCatIcon] = useState(ICONS[0]);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const dragIdx = useRef<number | null>(null);

  // 配件列表
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ slug: "", name: "", category: "", note: "" });
  const [error, setError] = useState("");
  const [orderSaving, setOrderSaving] = useState(false);
  const [orderSaved, setOrderSaved] = useState(false);
  const [productDragOver, setProductDragOver] = useState<number | null>(null);
  const productDragIdx = useRef<number | null>(null);

  useEffect(() => {
    fetch("/api/admin/products/intro")
      .then((r) => r.json())
      .then((data) => { setIntro(data); setIntroLoading(false); });
    fetch("/api/admin/products/categories")
      .then((r) => r.json())
      .then((data) => { setCats(data); setCatsLoading(false); });
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then((data) => { setProducts(data); setLoading(false); });
  }, []);

  async function saveIntro() {
    setIntroSaving(true);
    const res = await fetch("/api/admin/products/intro", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(intro),
    });
    if (res.ok) {
      markBuildTriggered();
      setIntroSaved(true);
      setTimeout(() => setIntroSaved(false), 3000);
    } else {
      alert("儲存文字失敗");
    }
    setIntroSaving(false);
  }

  async function saveCats() {
    setCatsSaving(true);
    const res = await fetch("/api/admin/products/categories", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cats),
    });
    if (res.ok) {
      markBuildTriggered();
      setCatsSaved(true);
      setTimeout(() => setCatsSaved(false), 3000);
    } else {
      alert("儲存分類失敗");
    }
    setCatsSaving(false);
  }

  function setField(key: keyof typeof form, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
    if (key === "name" && !form.slug) {
      setForm((f) => ({
        ...f,
        name: val,
        slug: val.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      }));
    }
  }

  async function submit() {
    setError("");
    if (!form.name || !form.slug) { setError("名稱和 Slug 為必填"); return; }
    setSubmitting(true);
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const { slug } = await res.json();
      router.push(`/admin/products/${slug}`);
    } else {
      const data = await res.json();
      setError(data.error === "slug already exists" ? "此 Slug 已存在" : "新增失敗，請重試");
      setSubmitting(false);
    }
  }

  async function saveOrder() {
    setOrderSaving(true);
    const res = await fetch("/api/admin/products", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(products),
    });
    if (res.ok) {
      markBuildTriggered();
      setOrderSaved(true);
      setTimeout(() => setOrderSaved(false), 3000);
    } else {
      alert("儲存排序失敗");
    }
    setOrderSaving(false);
  }

  const catLabel = Object.fromEntries(cats.map((c) => [c.id, c.label]));
  const catIcon = Object.fromEntries(cats.map((c) => [c.id, c.icon ?? "🧰"]));

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-stone-900">配件管理</h1>

      {/* 列表頁文字 */}
      <div className="mb-8 space-y-4 rounded-xl border border-stone-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-stone-900">列表頁文字</h2>
          <button
            onClick={saveIntro}
            disabled={introSaving}
            className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800 disabled:opacity-50"
          >
            {introSaving ? "儲存中..." : introSaved ? "✓ 已儲存" : "儲存文字"}
          </button>
        </div>
        <p className="text-xs text-stone-500">
          這段文字顯示在前台 /products 頁面最上方（標籤、標題、說明文字）。
        </p>
        {introLoading ? (
          <p className="text-stone-400">載入中…</p>
        ) : (
          <div className="space-y-3">
            <Field label="標籤（小字）">
              <input
                value={intro.eyebrow}
                onChange={(e) => setIntro((i) => ({ ...i, eyebrow: e.target.value }))}
                className="input"
                placeholder="例：改裝配件"
              />
            </Field>
            <Field label="標題">
              <input
                value={intro.title}
                onChange={(e) => setIntro((i) => ({ ...i, title: e.target.value }))}
                className="input"
                placeholder="例：床墊、木作、電力系統"
              />
            </Field>
            <Field label="說明文字">
              <textarea
                value={intro.subtitle}
                onChange={(e) => setIntro((i) => ({ ...i, subtitle: e.target.value }))}
                rows={2}
                className="input"
              />
            </Field>
          </div>
        )}
      </div>

      {/* 配件分類管理 */}
      <div className="mb-8 space-y-4 rounded-xl border border-stone-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-stone-900">配件分類管理</h2>
          <button
            onClick={saveCats}
            disabled={catsSaving}
            className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800 disabled:opacity-50"
          >
            {catsSaving ? "儲存中..." : catsSaved ? "✓ 已儲存" : "儲存分類"}
          </button>
        </div>
        <p className="text-xs text-stone-500">
          刪除分類不會刪除配件，但配件將顯示為未分類。可拖曳排序。
        </p>

        {catsLoading ? (
          <p className="text-stone-400">載入中…</p>
        ) : (
          <div className="space-y-2">
            {cats.map((cat, i) => (
              <div
                key={cat.id}
                draggable
                onDragStart={() => { dragIdx.current = i; }}
                onDragOver={(e) => { e.preventDefault(); setDragOver(i); }}
                onDragLeave={() => setDragOver(null)}
                onDrop={() => {
                  if (dragIdx.current !== null && dragIdx.current !== i) {
                    setCats((c) => {
                      const next = [...c];
                      const [moved] = next.splice(dragIdx.current!, 1);
                      next.splice(i, 0, moved);
                      return next;
                    });
                  }
                  setDragOver(null);
                  dragIdx.current = null;
                }}
                onDragEnd={() => { setDragOver(null); dragIdx.current = null; }}
                className={`flex items-center gap-3 rounded-lg border px-3 py-2 transition-colors ${
                  dragOver === i ? "border-emerald-400 bg-emerald-50" : "border-stone-200 bg-stone-50"
                }`}
              >
                <span className="shrink-0 cursor-grab select-none text-lg leading-none text-stone-300">⠿</span>
                <select
                  value={cat.icon ?? ICONS[0]}
                  onChange={(e) =>
                    setCats((c) => c.map((x) => (x.id === cat.id ? { ...x, icon: e.target.value } : x)))
                  }
                  className="input !w-14 shrink-0 text-center"
                >
                  {ICONS.map((icon) => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
                <span className="flex-1 truncate font-mono text-xs text-stone-400">{cat.id}</span>
                <input
                  value={cat.label}
                  onChange={(e) =>
                    setCats((c) => c.map((x) => (x.id === cat.id ? { ...x, label: e.target.value } : x)))
                  }
                  className="input flex-1"
                  placeholder="分類名稱"
                />
                <button
                  type="button"
                  onClick={() => setCats((c) => c.filter((x) => x.id !== cat.id))}
                  className="shrink-0 rounded px-2 py-1 text-xs text-rose-500 hover:bg-rose-50"
                >
                  刪除
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <select
            value={newCatIcon}
            onChange={(e) => setNewCatIcon(e.target.value)}
            className="input !w-14 shrink-0 text-center"
          >
            {ICONS.map((icon) => (
              <option key={icon} value={icon}>{icon}</option>
            ))}
          </select>
          <input
            value={newCatId}
            onChange={(e) => setNewCatId(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
            className="input flex-1 font-mono"
            placeholder="ID（英文）"
          />
          <input
            value={newCatLabel}
            onChange={(e) => setNewCatLabel(e.target.value)}
            className="input flex-1"
            placeholder="顯示名稱"
          />
          <button
            type="button"
            onClick={() => {
              const id = newCatId.trim();
              const label = newCatLabel.trim();
              if (!id || !label) return;
              if (cats.some((c) => c.id === id)) return;
              setCats((c) => [...c, { id, label, icon: newCatIcon }]);
              setNewCatId("");
              setNewCatLabel("");
              setNewCatIcon(ICONS[0]);
            }}
            className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
          >
            新增
          </button>
        </div>
      </div>

      {/* 配件列表 */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-stone-900">配件列表</h2>
        <div className="flex gap-2">
          <button
            onClick={saveOrder}
            disabled={orderSaving}
            className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-50"
          >
            {orderSaving ? "儲存中..." : orderSaved ? "✓ 已儲存" : "儲存排序"}
          </button>
          <button
            onClick={() => { setShowForm(true); setError(""); setForm({ slug: "", name: "", category: cats[0]?.id ?? "", note: "" }); }}
            className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800"
          >
            + 新增配件
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-stone-400">載入中…</p>
      ) : (
        <>
          <p className="mb-3 text-xs text-stone-500">拖曳卡片可調整順序，前台 /products 也會依此順序顯示，記得按「儲存排序」。</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p, i) => (
              <div
                key={p.slug}
                draggable
                onDragStart={() => { productDragIdx.current = i; }}
                onDragOver={(e) => { e.preventDefault(); setProductDragOver(i); }}
                onDragLeave={() => setProductDragOver(null)}
                onDrop={() => {
                  if (productDragIdx.current !== null && productDragIdx.current !== i) {
                    setProducts((list) => {
                      const next = [...list];
                      const [moved] = next.splice(productDragIdx.current!, 1);
                      next.splice(i, 0, moved);
                      return next;
                    });
                  }
                  setProductDragOver(null);
                  productDragIdx.current = null;
                }}
                onDragEnd={() => { setProductDragOver(null); productDragIdx.current = null; }}
                className={`rounded-xl border transition-colors ${
                  productDragOver === i ? "border-emerald-400 bg-emerald-50" : "border-stone-200 bg-white"
                }`}
              >
                <Link
                  href={`/admin/products/${p.slug}`}
                  className="flex cursor-grab items-center gap-4 p-5 transition-shadow hover:shadow-md"
                >
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-2xl">
                    {catIcon[p.category] ?? "🧰"}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-stone-900">{p.name}</p>
                    <p className="text-sm text-stone-500">{catLabel[p.category] ?? p.note}</p>
                    <p className="mt-1 text-xs text-stone-400">{p.images.length} 張圖片</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 新增配件 Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-bold text-stone-900">新增配件</h2>
            <div className="space-y-4">
              <Field label="配件名稱 *">
                <input
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                  className="input"
                  placeholder="例：磷酸鋰鐵電池"
                />
              </Field>
              <Field label="Slug *（英文 ID，用於網址）">
                <input
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") }))}
                  className="input"
                  placeholder="例：lifepo4-battery"
                />
              </Field>
              <Field label="分類">
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="input"
                >
                  <option value="">未分類</option>
                  {cats.map((c) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </Field>
              <Field label="簡短說明">
                <input
                  value={form.note}
                  onChange={(e) => setField("note", e.target.value)}
                  className="input"
                  placeholder="例：適合冷氣、冰箱長時間使用"
                />
              </Field>
              {error && <p className="text-sm text-rose-600">{error}</p>}
            </div>
            <div className="mt-5 flex gap-3">
              <button
                onClick={submit}
                disabled={submitting}
                className="flex-1 rounded-lg bg-emerald-700 py-2 text-sm font-medium text-white hover:bg-emerald-800 disabled:opacity-50"
              >
                {submitting ? "新增中..." : "新增並編輯"}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-50"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .input { width:100%; border-radius:8px; border:1px solid #e7e5e4; padding:8px 12px; font-size:14px; outline:none; }
        .input:focus { border-color:#059669; box-shadow:0 0 0 3px rgba(5,150,105,0.1); }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-stone-700">{label}</label>
      {children}
    </div>
  );
}
