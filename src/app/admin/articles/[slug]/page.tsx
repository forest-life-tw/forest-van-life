"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArticleForm } from "../new/page";

export default function EditArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [slug, setSlug] = useState("");
  const [saving, setSaving] = useState(false);
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
    if (res.ok) router.push("/admin/articles");
    else alert("儲存失敗");
    setSaving(false);
  }

  async function handleDelete() {
    if (!confirm(`確定要刪除「${form.title}」？`)) return;
    const res = await fetch(`/api/admin/articles/${slug}?cat=${form.category}`, { method: "DELETE" });
    if (res.ok) router.push("/admin/articles");
    else alert("刪除失敗");
  }

  return <ArticleForm form={form} set={set} onSave={save} saving={saving} onDelete={handleDelete} />;
}
