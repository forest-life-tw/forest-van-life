"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Car = { slug: string; name: string; note: string; images: string[] };

export default function CarsAdminPage() {
  const router = useRouter();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ slug: "", name: "", note: "", description: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/cars")
      .then((r) => r.json())
      .then((data) => { setCars(data); setLoading(false); });
  }, []);

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
    const res = await fetch("/api/admin/cars", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const { slug } = await res.json();
      router.push(`/admin/cars/${slug}`);
    } else {
      const data = await res.json();
      setError(data.error === "slug already exists" ? "此 Slug 已存在" : "新增失敗，請重試");
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-900">車型管理</h1>
        <button
          onClick={() => { setShowForm(true); setError(""); setForm({ slug: "", name: "", note: "", description: "" }); }}
          className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800"
        >
          + 新增車型
        </button>
      </div>

      {loading ? (
        <p className="text-stone-400">載入中…</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cars.map((car) => (
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
      )}

      {/* 新增車型 Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-bold text-stone-900">新增車型</h2>
            <div className="space-y-4">
              <Field label="車型名稱 *">
                <input
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                  className="input"
                  placeholder="例：Toyota Hiace"
                />
              </Field>
              <Field label="Slug *（英文 ID，用於網址）">
                <input
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") }))}
                  className="input"
                  placeholder="例：hiace"
                />
              </Field>
              <Field label="簡短說明">
                <input
                  value={form.note}
                  onChange={(e) => setField("note", e.target.value)}
                  className="input"
                  placeholder="例：經典商用底盤"
                />
              </Field>
              <Field label="詳細介紹">
                <textarea
                  value={form.description}
                  onChange={(e) => setField("description", e.target.value)}
                  rows={3}
                  className="input"
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
