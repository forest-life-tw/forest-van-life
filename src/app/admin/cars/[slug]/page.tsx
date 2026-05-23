"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { markBuildTriggered } from "@/lib/build-signal";

type CarData = {
  name: string; note: string; description: string; images: string[]; content: string;
};

export default function EditCarPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const [slug, setSlug] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [car, setCar] = useState<CarData>({ name: "", note: "", description: "", images: [], content: "" });
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

  async function deleteCar() {
    setDeleting(true);
    const res = await fetch(`/api/admin/cars/${slug}`, { method: "DELETE" });
    if (res.ok) { markBuildTriggered(); router.push("/admin/cars"); }
    else { alert("刪除失敗"); setDeleting(false); setConfirmDelete(false); }
  }

  async function save() {
    setSaving(true);
    const res = await fetch(`/api/admin/cars/${slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(car),
    });
    if (res.ok) { markBuildTriggered(); router.push("/admin/cars"); }
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
        <div className="flex gap-2">
          <button
            onClick={() => setConfirmDelete(true)}
            className="rounded-lg border border-rose-200 px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50"
          >
            刪除車型
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="rounded-lg bg-emerald-700 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-800 disabled:opacity-50"
          >
            {saving ? "儲存中..." : "儲存"}
          </button>
        </div>
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="mb-2 text-lg font-bold text-stone-900">確認刪除車型</h2>
            <p className="mb-1 text-sm text-stone-600">
              即將刪除「{car.name}」，這個操作無法復原：
            </p>
            <ul className="mb-5 mt-2 space-y-1 text-sm text-stone-500">
              <li>• 從車型列表移除</li>
              <li>• 刪除改裝說明內容（如有）</li>
              <li>• 已上傳的圖片連結仍會保留在 Blob</li>
            </ul>
            <div className="flex gap-3">
              <button
                onClick={deleteCar}
                disabled={deleting}
                className="flex-1 rounded-lg bg-rose-600 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-50"
              >
                {deleting ? "刪除中..." : "確認刪除"}
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-50"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-5 rounded-xl border border-stone-200 bg-white p-6">
        <Field label="車型名稱">
          <input value={car.name} onChange={(e) => set("name", e.target.value)} className="input" />
        </Field>
        <Field label="簡短說明">
          <input value={car.note} onChange={(e) => set("note", e.target.value)} className="input" placeholder="例：貨車版 / Camper" />
        </Field>
        <Field label="詳細介紹">
          <textarea value={car.description} onChange={(e) => set("description", e.target.value)}
            rows={4} className="input" />
        </Field>

        {/* 改裝內容 */}
        <Field label="這台車能怎麼改（Markdown 格式）">
          <p className="mb-1.5 text-xs text-stone-500">
            支援 Markdown：## 標題、**粗體**、- 清單、--- 分隔線
          </p>
          <textarea
            value={car.content}
            onChange={(e) => set("content", e.target.value)}
            rows={16}
            className="input font-mono text-sm"
            placeholder={"## 適合改裝項目\n\n- 臥鋪木作\n- 副電池系統\n\n## 合法路線\n\n貨車變更登記路線..."}
          />
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
        .input { width:100%; border-radius:8px; border:1px solid #e7e5e4; padding:8px 12px; font-size:14px; outline:none; resize:vertical; }
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
