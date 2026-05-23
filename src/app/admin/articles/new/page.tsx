"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { markBuildTriggered } from "@/lib/build-signal";

export default function NewArticlePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "laws",
    light: "",
    tags: "",
    updated: new Date().toISOString().slice(0, 10),
    content: "",
  });

  function set(key: string, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function save() {
    if (!form.title.trim()) return alert("請填入標題");
    setSaving(true);
    const res = await fetch("/api/admin/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      markBuildTriggered();
      router.push("/admin/articles");
    } else {
      alert("儲存失敗，請稍後再試");
    }
    setSaving(false);
  }

  return <ArticleForm form={form} set={set} onSave={save} saving={saving} isNew />;
}

export function ArticleForm({
  form, set, onSave, saving, isNew, onDelete,
}: {
  form: Record<string, string>;
  set: (k: string, v: string) => void;
  onSave: () => void;
  saving: boolean;
  isNew?: boolean;
  onDelete?: () => void;
}) {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-900">{isNew ? "新增文章" : "編輯文章"}</h1>
        <div className="flex gap-2">
          {onDelete && (
            <button onClick={onDelete} className="rounded-lg border border-rose-300 px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50">
              刪除
            </button>
          )}
          <button
            onClick={onSave}
            disabled={saving}
            className="rounded-lg bg-emerald-700 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-800 disabled:opacity-50"
          >
            {saving ? "儲存中..." : "儲存發佈"}
          </button>
        </div>
      </div>

      <div className="space-y-5 rounded-xl border border-stone-200 bg-white p-6">
        <Field label="標題">
          <input value={form.title} onChange={(e) => set("title", e.target.value)}
            className="input" placeholder="文章標題" />
        </Field>

        <Field label="摘要說明">
          <input value={form.description} onChange={(e) => set("description", e.target.value)}
            className="input" placeholder="一句話描述這篇文章" />
        </Field>

        <div className="grid grid-cols-3 gap-4">
          <Field label="分類">
            <select value={form.category} onChange={(e) => set("category", e.target.value)} className="input">
              <option value="design">構思設計</option>
              <option value="laws">法規制度</option>
              <option value="others">其他</option>
            </select>
          </Field>
          <Field label="合法燈號">
            <select value={form.light} onChange={(e) => set("light", e.target.value)} className="input">
              <option value="">無</option>
              <option value="green">🟢 合法綠燈</option>
              <option value="yellow">🟡 條件合法</option>
              <option value="red">🔴 高風險</option>
            </select>
          </Field>
          <Field label="更新日期">
            <input type="date" value={form.updated} onChange={(e) => set("updated", e.target.value)} className="input" />
          </Field>
        </div>

        <Field label="標籤（逗號分隔）">
          <input value={form.tags} onChange={(e) => set("tags", e.target.value)}
            className="input" placeholder="例：駐車冷氣, 法規" />
        </Field>

        <Field label="內文（Markdown 格式）">
          <textarea
            value={form.content}
            onChange={(e) => set("content", e.target.value)}
            rows={20}
            className="input font-mono text-xs leading-relaxed"
            placeholder="## 段落標題&#10;&#10;內文..."
          />
        </Field>
      </div>

      <style jsx global>{`
        .input {
          width: 100%;
          border-radius: 8px;
          border: 1px solid #e7e5e4;
          padding: 8px 12px;
          font-size: 14px;
          outline: none;
        }
        .input:focus {
          border-color: #059669;
          box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1);
        }
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
