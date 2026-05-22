"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type CarData = {
  name: string; note: string; description: string; images: string[];
};

export default function EditCarPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const [slug, setSlug] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [car, setCar] = useState<CarData>({ name: "", note: "", description: "", images: [] });
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    params.then(async ({ slug: s }) => {
      setSlug(s);
      const res = await fetch(`/api/admin/cars/${s}`);
      if (res.ok) setCar(await res.json());
    });
  }, [params]);

  function set(key: keyof CarData, val: string) {
    setCar((c) => ({ ...c, [key]: val }));
  }

  async function save() {
    setSaving(true);
    const res = await fetch(`/api/admin/cars/${slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(car),
    });
    if (res.ok) router.push("/admin/cars");
    else alert("儲存失敗");
    setSaving(false);
  }

  async function uploadImages(files: FileList) {
    setUploading(true);
    const newUrls: string[] = [];
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("carSlug", slug);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (res.ok) {
        const { url } = await res.json();
        newUrls.push(url);
      }
    }
    setCar((c) => ({ ...c, images: [...c.images, ...newUrls] }));
    setUploading(false);
  }

  function removeImage(url: string) {
    setCar((c) => ({ ...c, images: c.images.filter((i) => i !== url) }));
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-900">編輯車型：{car.name}</h1>
        <button
          onClick={save}
          disabled={saving}
          className="rounded-lg bg-emerald-700 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-800 disabled:opacity-50"
        >
          {saving ? "儲存中..." : "儲存"}
        </button>
      </div>

      <div className="space-y-5 rounded-xl border border-stone-200 bg-white p-6">
        <Field label="車型名稱">
          <input value={car.name} onChange={(e) => set("name", e.target.value)} className="input" />
        </Field>
        <Field label="簡短說明">
          <input value={car.note} onChange={(e) => set("note", e.target.value)} className="input" placeholder="例：貨車版 / Camper" />
        </Field>
        <Field label="詳細介紹">
          <textarea value={car.description} onChange={(e) => set("description", e.target.value)}
            rows={5} className="input" />
        </Field>

        {/* Images */}
        <div>
          <label className="mb-2 block text-sm font-medium text-stone-700">展示圖片</label>
          <div className="grid grid-cols-3 gap-3">
            {car.images.map((url) => (
              <div key={url} className="group relative aspect-video overflow-hidden rounded-lg border border-stone-200 bg-stone-50">
                <Image src={url} alt="" fill className="object-cover" sizes="200px" />
                <button
                  onClick={() => removeImage(url)}
                  className="absolute right-1 top-1 hidden rounded-full bg-rose-600 p-1 text-white group-hover:flex"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                    <path d="M10 2L2 10M2 2l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="flex aspect-video items-center justify-center rounded-lg border-2 border-dashed border-stone-300 text-stone-400 hover:border-emerald-400 hover:text-emerald-600 disabled:opacity-50"
            >
              {uploading ? "上傳中..." : "+ 新增圖片"}
            </button>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && uploadImages(e.target.files)}
          />
        </div>
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
