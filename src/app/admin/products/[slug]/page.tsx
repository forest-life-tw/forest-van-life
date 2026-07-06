"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { markBuildTriggered } from "@/lib/build-signal";

type Category = { id: string; label: string };

type ProductData = {
  name: string;
  category: string;
  note: string;
  images: string[];
  content: string;
};

export default function EditProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const [slug, setSlug] = useState("");
  const [cats, setCats] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [product, setProduct] = useState<ProductData>({
    name: "", category: "", note: "", images: [], content: "",
  });
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/admin/products/categories")
      .then((r) => r.json())
      .then(setCats);
    params.then(async ({ slug: s }) => {
      setSlug(s);
      const res = await fetch(`/api/admin/products/${s}`);
      if (!res.ok) return;
      const data = await res.json();
      setProduct({ ...data, content: data.content ?? "" });
    });
  }, [params]);

  function set(key: keyof Pick<ProductData, "name" | "category" | "note" | "content">, val: string) {
    setProduct((p) => ({ ...p, [key]: val }));
  }

  function removeImage(url: string) {
    setProduct((p) => ({ ...p, images: p.images.filter((img) => img !== url) }));
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    const newUrls: string[] = [];
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("productSlug", slug);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (res.ok) {
        const { url } = await res.json();
        newUrls.push(url);
      }
    }
    setProduct((p) => ({ ...p, images: [...p.images, ...newUrls] }));
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function deleteProduct() {
    setDeleting(true);
    const res = await fetch(`/api/admin/products/${slug}`, { method: "DELETE" });
    if (res.ok) { markBuildTriggered(); router.push("/admin/products"); }
    else { alert("刪除失敗"); setDeleting(false); setConfirmDelete(false); }
  }

  async function save() {
    setSaving(true);
    const { content, ...rest } = product;
    const res = await fetch(`/api/admin/products/${slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...rest, content }),
    });
    if (res.ok) { markBuildTriggered(); router.push("/admin/products"); }
    else alert("儲存失敗");
    setSaving(false);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-900">編輯配件：{product.name}</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setConfirmDelete(true)}
            className="rounded-lg border border-rose-200 px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50"
          >
            刪除配件
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
            <h2 className="mb-2 text-lg font-bold text-stone-900">確認刪除配件</h2>
            <p className="mb-1 text-sm text-stone-600">即將刪除「{product.name}」，這個操作無法復原：</p>
            <ul className="mb-5 mt-2 space-y-1 text-sm text-stone-500">
              <li>• 從配件列表移除</li>
              <li>• 刪除詳細介紹內容（如有）</li>
              <li>• 已上傳的圖片連結仍會保留在 Blob</li>
            </ul>
            <div className="flex gap-3">
              <button
                onClick={deleteProduct}
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
        <Field label="配件名稱">
          <input value={product.name} onChange={(e) => set("name", e.target.value)} className="input" />
        </Field>
        <Field label="分類">
          <select value={product.category} onChange={(e) => set("category", e.target.value)} className="input">
            <option value="">未分類</option>
            {cats.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </Field>
        <Field label="簡短說明">
          <input value={product.note} onChange={(e) => set("note", e.target.value)} className="input" placeholder="例：適合冷氣、冰箱長時間使用" />
        </Field>

        <Field label="詳細介紹（Markdown 格式）">
          <p className="mb-1.5 text-xs text-stone-500">
            支援 Markdown：## 標題、**粗體**、- 清單、--- 分隔線
          </p>
          <textarea
            value={product.content}
            onChange={(e) => set("content", e.target.value)}
            rows={16}
            className="input font-mono text-sm"
            placeholder={"## 規格\n\n- 容量：300AH\n- 電壓：12V\n\n## 適用情境\n\n適合長時間使用冷氣、冰箱..."}
          />
        </Field>

        {/* 實品照片 */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-stone-700">實品照片</label>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {product.images.map((url) => (
              <div key={url} className="group relative aspect-video overflow-hidden rounded-lg border border-stone-200 bg-stone-50">
                <Image src={url} alt="" fill className="object-cover" sizes="200px" />
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="absolute right-1 top-1 hidden rounded-full bg-rose-600 p-1 text-white group-hover:flex"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M10 2L2 10M2 2l8 8" />
                  </svg>
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => { if (fileRef.current) { fileRef.current.value = ""; fileRef.current.click(); } }}
              disabled={uploading}
              className="flex aspect-video items-center justify-center rounded-lg border-2 border-dashed border-stone-300 text-sm text-stone-400 hover:border-emerald-400 hover:text-emerald-600 disabled:opacity-50"
            >
              {uploading ? "上傳中..." : "+ 上傳"}
            </button>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
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
