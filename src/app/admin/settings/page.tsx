"use client";
import { useEffect, useRef, useState } from "react";
import { markBuildTriggered } from "@/lib/build-signal";

type Feature = { icon: string; title: string; desc: string };
type Config = {
  logo: string;
  homepage: { heroTitle: string; heroSubtitle: string; features: Feature[] };
  contact: { address: string; lineUrl: string; businessHours: string };
  about: {
    intro: string[];
    services: string[];
    consultationTitle: string;
    consultationDesc: string;
    consultationSteps: string[];
  };
};

const DEFAULT: Config = {
  logo: "/logo.png",
  homepage: {
    heroTitle: "",
    heroSubtitle: "",
    features: [
      { icon: "📋", title: "", desc: "" },
      { icon: "✅", title: "", desc: "" },
      { icon: "🔧", title: "", desc: "" },
    ],
  },
  contact: { address: "", lineUrl: "", businessHours: "" },
  about: {
    intro: ["", ""],
    services: [],
    consultationTitle: "",
    consultationDesc: "",
    consultationSteps: [],
  },
};

export default function SettingsPage() {
  const [cfg, setCfg] = useState<Config>(DEFAULT);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => setCfg((prev) => ({ ...prev, ...d })));
  }, []);

  function setContact(key: keyof Config["contact"], val: string) {
    setCfg((c) => ({ ...c, contact: { ...c.contact, [key]: val } }));
  }
  function setHero(key: "heroTitle" | "heroSubtitle", val: string) {
    setCfg((c) => ({ ...c, homepage: { ...c.homepage, [key]: val } }));
  }
  function setFeature(i: number, key: keyof Feature, val: string) {
    setCfg((c) => {
      const features = c.homepage.features.map((f, idx) =>
        idx === i ? { ...f, [key]: val } : f
      );
      return { ...c, homepage: { ...c.homepage, features } };
    });
  }
  function setAbout(key: keyof Config["about"], val: string | string[]) {
    setCfg((c) => ({ ...c, about: { ...c.about, [key]: val } }));
  }

  async function save() {
    setSaving(true);
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contact: cfg.contact,
        homepage: cfg.homepage,
        about: cfg.about,
      }),
    });
    if (res.ok) {
      markBuildTriggered();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      alert("儲存失敗");
    }
    setSaving(false);
  }

  async function uploadLogo(file: File) {
    setLogoUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("type", "logo");
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      if (!res.ok) throw new Error();
      const { url } = await res.json();
      const saveRes = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logo: url }),
      });
      if (!saveRes.ok) throw new Error();
      setCfg((c) => ({ ...c, logo: url }));
      alert("Logo 已更新，約 1 分鐘後在網站生效");
    } catch {
      alert("上傳失敗");
    }
    setLogoUploading(false);
  }

  const introText = cfg.about.intro.join("\n\n");
  const servicesText = cfg.about.services.join("\n");
  const stepsText = cfg.about.consultationSteps.join("\n");

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-900">網站設定</h1>
        <button
          onClick={save}
          disabled={saving}
          className="rounded-lg bg-emerald-700 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-800 disabled:opacity-50"
        >
          {saving ? "儲存中..." : saved ? "✓ 已儲存" : "儲存所有內容"}
        </button>
      </div>

      {/* Logo */}
      <Card title="Logo">
        <div className="flex items-center gap-5">
          {cfg.logo && (
            <div className="h-14 w-auto relative">
              <img src={cfg.logo} alt="Logo" className="h-14 w-auto object-contain" />
            </div>
          )}
          <div>
            <button
              onClick={() => fileRef.current?.click()}
              disabled={logoUploading}
              className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-50"
            >
              {logoUploading ? "上傳中..." : "更換 Logo"}
            </button>
            <p className="mt-1 text-xs text-stone-500">建議 PNG，高度 80px 以上，儲存後約 1 分鐘生效</p>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) uploadLogo(file);
              e.target.value = "";
            }}
          />
        </div>
      </Card>

      {/* 首頁 Hero */}
      <Card title="首頁文字">
        <Field label="主標題">
          <textarea
            rows={2}
            value={cfg.homepage.heroTitle}
            onChange={(e) => setHero("heroTitle", e.target.value)}
            className="input"
          />
        </Field>
        <Field label="副標題">
          <textarea
            rows={4}
            value={cfg.homepage.heroSubtitle}
            onChange={(e) => setHero("heroSubtitle", e.target.value)}
            className="input"
          />
        </Field>
      </Card>

      {/* 三大特色 */}
      <Card title="首頁三大特色">
        {cfg.homepage.features.map((f, i) => (
          <div key={i} className="rounded-lg border border-stone-100 bg-stone-50 p-4 space-y-3">
            <p className="text-xs font-semibold text-stone-500 uppercase">特色 {i + 1}</p>
            <div className="flex gap-3">
              <Field label="圖示（Emoji）">
                <input
                  value={f.icon}
                  onChange={(e) => setFeature(i, "icon", e.target.value)}
                  className="input w-20 text-center text-xl"
                />
              </Field>
              <Field label="標題" className="flex-1">
                <input
                  value={f.title}
                  onChange={(e) => setFeature(i, "title", e.target.value)}
                  className="input"
                />
              </Field>
            </div>
            <Field label="說明文字">
              <textarea
                rows={2}
                value={f.desc}
                onChange={(e) => setFeature(i, "desc", e.target.value)}
                className="input"
              />
            </Field>
          </div>
        ))}
      </Card>

      {/* 關於我們 */}
      <Card title="關於我們（介紹文字）">
        <Field label="段落（每段用空白行分開）">
          <textarea
            rows={6}
            value={introText}
            onChange={(e) =>
              setAbout(
                "intro",
                e.target.value.split(/\n\n+/).map((s) => s.trim()).filter(Boolean)
              )
            }
            className="input"
            placeholder={"第一段落\n\n第二段落"}
          />
        </Field>
        <Field label="主要服務（每行一項）">
          <textarea
            rows={6}
            value={servicesText}
            onChange={(e) =>
              setAbout(
                "services",
                e.target.value.split("\n").map((s) => s.trim()).filter(Boolean)
              )
            }
            className="input"
            placeholder={"✦ 座位數變更\n✦ 車頂置物架"}
          />
        </Field>
      </Card>

      {/* 預約諮詢 */}
      <Card title="預約諮詢區塊">
        <Field label="標題">
          <input
            value={cfg.about.consultationTitle}
            onChange={(e) => setAbout("consultationTitle", e.target.value)}
            className="input"
          />
        </Field>
        <Field label="說明文字">
          <textarea
            rows={2}
            value={cfg.about.consultationDesc}
            onChange={(e) => setAbout("consultationDesc", e.target.value)}
            className="input"
          />
        </Field>
        <Field label="諮詢步驟（每行一項）">
          <textarea
            rows={5}
            value={stepsText}
            onChange={(e) =>
              setAbout(
                "consultationSteps",
                e.target.value.split("\n").map((s) => s.trim()).filter(Boolean)
              )
            }
            className="input"
            placeholder={"1. 你的車型\n2. 預計改裝項目"}
          />
        </Field>
      </Card>

      {/* 聯絡資訊 */}
      <Card title="聯絡資訊">
        <Field label="地址">
          <input
            value={cfg.contact.address}
            onChange={(e) => setContact("address", e.target.value)}
            className="input"
          />
        </Field>
        <Field label="LINE 連結">
          <input
            value={cfg.contact.lineUrl}
            onChange={(e) => setContact("lineUrl", e.target.value)}
            className="input"
            placeholder="https://line.me/..."
          />
        </Field>
        <Field label="營業時間">
          <input
            value={cfg.contact.businessHours}
            onChange={(e) => setContact("businessHours", e.target.value)}
            className="input"
            placeholder="例：週一至週六 09:00–18:00"
          />
        </Field>
      </Card>

      <div className="pb-8 flex justify-end">
        <button
          onClick={save}
          disabled={saving}
          className="rounded-lg bg-emerald-700 px-6 py-2.5 text-sm font-medium text-white hover:bg-emerald-800 disabled:opacity-50"
        >
          {saving ? "儲存中..." : saved ? "✓ 已儲存" : "儲存所有內容"}
        </button>
      </div>

      <style jsx global>{`
        .input { width:100%; border-radius:8px; border:1px solid #e7e5e4; padding:8px 12px; font-size:14px; outline:none; resize:vertical; }
        .input:focus { border-color:#059669; box-shadow:0 0 0 3px rgba(5,150,105,0.1); }
      `}</style>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-6 space-y-4">
      <h2 className="font-semibold text-stone-800">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-sm font-medium text-stone-700">{label}</label>
      {children}
    </div>
  );
}
