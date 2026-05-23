"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArticleForm } from "../new/page";
import { markBuildTriggered } from "@/lib/build-signal";

export default function EditArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [slug, setSlug] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", category: "laws",
    light: "", tags: "", updated: "", content: "",
  });

  useEffect(() => {
    params.then(async ({ slug: s }) => {
      setSlug(s);
      const cat = searchParams.get("cat") ?? "laws";
      const res = await fetch(`/api/admin/articles/${s}?cat=${cat}`);
      if (res.ok) {
        const data = await res.json();
        setForm({
          title: data.title ?? "",
          description: data.description ?? "",
          category: cat,
          light: data.light ?? "",
          tags: (data.tags ?? []).join(", "),
          updated: data.updated ?? "",
          content: data.content ?? "",
        });
      }
    });
  }, [params, searchParams]);

  function set(key: string, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function save() {
    setSaving(true);
    const res = await fetch(`/api/admin/articles/${slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, oldCategory: searchParams.get("cat") ?? "laws" }),
    });
    if (res.ok) { markBuildTriggered(); router.push("/admin/articles"); }
    else alert("儲存失敗");
    setSaving(false);
  }

  async function executeDelete() {
    setDeleting(true);
    const res = await fetch(`/api/admin/articles/${slug}?cat=${form.category}`, { method: "DELETE" });
    if (res.ok) { markBuildTriggered(); router.push("/admin/articles"); }
    else { alert("刪除失敗"); setDeleting(false); setConfirmDelete(false); }
  }

  return (
    <>
      <ArticleForm form={form} set={set} onSave={save} saving={saving} onDelete={() => setConfirmDelete(true)} />

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="mb-2 text-lg font-bold text-stone-900">確認刪除文章</h2>
            <p className="mb-5 text-sm text-stone-600">
              即將刪除「{form.title}」，這個操作無法復原。
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
                onClick={() => setConfirmDelete(false)}
                className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-50"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
