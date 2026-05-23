"use client";
import { useEffect, useState } from "react";

type Contact = { address: string; lineUrl: string; businessHours: string };

export default function SettingsPage() {
  const [contact, setContact] = useState<Contact>({ address: "", lineUrl: "", businessHours: "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings").then((r) => r.json()).then((d) => setContact(d.contact ?? contact));
  }, []);

  function set(key: keyof Contact, val: string) {
    setContact((c) => ({ ...c, [key]: val }));
  }

  async function save() {
    setSaving(true);
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contact }),
    });
    if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 3000); }
    else alert("儲存失敗");
    setSaving(false);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-900">網站設定</h1>
        <button
          onClick={save}
          disabled={saving}
          className="rounded-lg bg-emerald-700 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-800 disabled:opacity-50"
        >
          {saving ? "儲存中..." : saved ? "✓ 已儲存" : "儲存"}
        </button>
      </div>

      <div className="rounded-xl border border-stone-200 bg-white p-6 space-y-5">
        <h2 className="font-semibold text-stone-800">聯絡資訊</h2>
        <Field label="地址">
          <input value={contact.address} onChange={(e) => set("address", e.target.value)}
            className="input" />
        </Field>
        <Field label="LINE 連結">
          <input value={contact.lineUrl} onChange={(e) => set("lineUrl", e.target.value)}
            className="input" placeholder="https://line.me/..." />
        </Field>
        <Field label="營業時間">
          <input value={contact.businessHours} onChange={(e) => set("businessHours", e.target.value)}
            className="input" placeholder="例：週一至週六 09:00–18:00" />
        </Field>
      </div>

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
