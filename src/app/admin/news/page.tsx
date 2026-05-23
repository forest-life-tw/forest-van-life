"use client";
import { useEffect, useState } from "react";
import { markBuildTriggered } from "@/lib/build-signal";
import type { NewsItem, NewsType } from "@/lib/news";

const TYPE_CONFIG: Record<NewsType, { label: string; cls: string }> = {
  youtube: { label: "YouTube", cls: "bg-rose-100 text-rose-700" },
  "fb-group": { label: "FB 社團", cls: "bg-blue-100 text-blue-700" },
  "fb-page": { label: "FB 粉專", cls: "bg-blue-100 text-blue-700" },
  manufacturer: { label: "車廠", cls: "bg-stone-100 text-stone-600" },
};

const EMPTY_FORM = {
  title: "",
  url: "",
  type: "youtube" as NewsType,
  sourceName: "",
  date: new Date().toISOString().slice(0, 10),
  note: "",
  thumbnail: "",
};

export default function NewsAdminPage() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState<NewsItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    fetch("/api/admin/news")
      .then((r) => r.json())
      .then((data) => {
        setItems(data.items ?? []);
        setLoading(false);
      });
  }, []);

  function setField(key: keyof typeof EMPTY_FORM, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function submit() {
    if (!form.title.trim() || !form.url.trim() || !form.sourceName.trim() || !form.date) {
      setSubmitError("請填寫標題、連結、來源名稱、日期");
      return;
    }
    setSubmitError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const data = await res.json();
        setItems((prev) => [data.item, ...prev]);
        setShowForm(false);
        setForm({ ...EMPTY_FORM, date: new Date().toISOString().slice(0, 10) });
        markBuildTriggered();
      } else {
        const err = await res.json().catch(() => ({}));
        setSubmitError(err.error === "missing fields" ? "請填寫必填欄位" : "儲存失敗，請稍後再試");
      }
    } catch {
      setSubmitError("網路錯誤，請檢查連線後重試");
    } finally {
      setSubmitting(false);
    }
  }

  async function executeDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/news/${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        setItems((prev) => prev.filter((item) => item.id !== deleteTarget.id));
        setDeleteTarget(null);
        markBuildTriggered();
      } else {
        setDeleting(false);
      }
    } catch {
      setDeleting(false);
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">露營大小事</h1>
          <p className="mt-1 text-sm text-stone-500">策展 FB 社團貼文、粉專、車廠動態、YouTube 影片</p>
        </div>
        <button
          onClick={() => {
            setForm({ ...EMPTY_FORM, date: new Date().toISOString().slice(0, 10) });
            setSubmitError("");
            setShowForm(true);
          }}
          className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800"
        >
          + 新增連結
        </button>
      </div>

      {loading ? (
        <p className="text-stone-400">載入中…</p>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-stone-200 bg-white p-14 text-center">
          <p className="text-2xl mb-3">📰</p>
          <p className="font-medium text-stone-700">尚無內容</p>
          <p className="mt-1 text-sm text-stone-400">點擊「新增連結」開始策展</p>
        </div>
      ) : (
        <div className="rounded-xl border border-stone-200 bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-stone-200 bg-stone-50 text-left text-xs text-stone-500">
              <tr>
                <th className="px-4 py-3 font-medium">來源</th>
                <th className="px-4 py-3 font-medium">標題</th>
                <th className="px-4 py-3 font-medium">日期</th>
                <th className="px-4 py-3 font-medium w-14"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => {
                const cfg = TYPE_CONFIG[item.type];
                return (
                  <tr key={item.id} className={i > 0 ? "border-t border-stone-100" : ""}>
                    <td className="px-4 py-3">
                      <span className={`rounded px-2 py-0.5 text-xs font-medium ${cfg.cls}`}>
                        {cfg.label}
                      </span>
                      <span className="ml-2 text-stone-600">{item.sourceName}</span>
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-stone-900 hover:text-emerald-700 hover:underline line-clamp-1"
                      >
                        {item.title}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-stone-400 whitespace-nowrap">{item.date}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setDeleteTarget(item)}
                        className="text-rose-500 hover:text-rose-700 text-xs font-medium"
                      >
                        刪除
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* 新增 Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="mb-5 text-xl font-bold text-stone-900">新增露營大小事</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Field label="來源類型">
                  <select
                    value={form.type}
                    onChange={(e) => setField("type", e.target.value)}
                    className="input"
                  >
                    <option value="youtube">YouTube 影片</option>
                    <option value="fb-group">FB 社團</option>
                    <option value="fb-page">FB 粉專</option>
                    <option value="manufacturer">車廠</option>
                  </select>
                </Field>
                <Field label="來源名稱 *">
                  <input
                    value={form.sourceName}
                    onChange={(e) => setField("sourceName", e.target.value)}
                    className="input"
                    placeholder="例：森活家露營車"
                  />
                </Field>
              </div>
              <Field label="標題 *">
                <input
                  value={form.title}
                  onChange={(e) => setField("title", e.target.value)}
                  className="input"
                  placeholder="貼文標題或影片名稱"
                />
              </Field>
              <Field label="連結 URL *">
                <input
                  value={form.url}
                  onChange={(e) => setField("url", e.target.value)}
                  className="input"
                  placeholder="https://..."
                  type="url"
                />
              </Field>
              <Field label="日期 *">
                <input
                  value={form.date}
                  onChange={(e) => setField("date", e.target.value)}
                  className="input"
                  type="date"
                />
              </Field>
              {form.type !== "youtube" && (
                <Field label="縮圖 URL（選填）">
                  <input
                    value={form.thumbnail}
                    onChange={(e) => setField("thumbnail", e.target.value)}
                    className="input"
                    placeholder="https://... 可右鍵貼文圖片→複製圖片網址"
                    type="url"
                  />
                </Field>
              )}
              <Field label="備註（選填）">
                <input
                  value={form.note}
                  onChange={(e) => setField("note", e.target.value)}
                  className="input"
                  placeholder="補充說明"
                />
              </Field>
            </div>
            {submitError && (
              <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">
                {submitError}
              </p>
            )}
            <div className="mt-5 flex gap-3">
              <button
                onClick={submit}
                disabled={submitting}
                className="flex-1 rounded-lg bg-emerald-700 py-2 text-sm font-medium text-white hover:bg-emerald-800 disabled:opacity-50"
              >
                {submitting ? "儲存中..." : "新增"}
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

      {/* 刪除確認 Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="mb-2 text-lg font-bold text-stone-900">確認刪除</h2>
            <p className="mb-5 text-sm text-stone-600">
              即將刪除「{deleteTarget.title}」，這個操作無法復原。
            </p>
            <div className="flex gap-3">
              <button
                onClick={executeDelete}
                disabled={deleting}
                className="flex-1 rounded-lg bg-rose-600 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-50"
              >
                {deleting ? "刪除中..." : "確認刪除"}
              </button>
              <button
                onClick={() => setDeleteTarget(null)}
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
