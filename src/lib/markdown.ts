import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

const CONTENT_DIR = path.join(process.cwd(), "content");

export type DocCategory = "laws" | "cars" | "design" | "others";

export type DocMeta = {
  slug: string;
  title: string;
  description?: string;
  order?: number;
  tags?: string[];
  updated?: string;
  light?: "green" | "yellow" | "red";
};

export type Doc = DocMeta & {
  html: string;
  raw: string;
};

function readDir(category: DocCategory): string[] {
  const dir = path.join(CONTENT_DIR, category);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

function normalizeUpdated(value: unknown): string | undefined {
  if (!value) return undefined;
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  return String(value);
}

export function listDocs(category: DocCategory): DocMeta[] {
  const slugs = readDir(category);
  const docs = slugs.map((slug) => {
    const file = fs.readFileSync(
      path.join(CONTENT_DIR, category, `${slug}.md`),
      "utf8",
    );
    const { data } = matter(file);
    return {
      slug,
      title: data.title ?? slug,
      description: data.description,
      order: data.order,
      tags: data.tags,
      updated: normalizeUpdated(data.updated),
      light: data.light,
    } satisfies DocMeta;
  });
  return docs.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
}

export async function getKnowhowDoc(
  slug: string,
): Promise<{ doc: Doc; category: DocCategory } | null> {
  for (const cat of ["laws", "design", "others"] as const) {
    const doc = await getDoc(cat, slug);
    if (doc) return { doc, category: cat };
  }
  return null;
}

export async function getDoc(
  category: DocCategory,
  slug: string,
): Promise<Doc | null> {
  const file = path.join(CONTENT_DIR, category, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  const processed = await remark().use(remarkGfm).use(remarkHtml).process(content);
  return {
    slug,
    title: data.title ?? slug,
    description: data.description,
    order: data.order,
    tags: data.tags,
    updated: normalizeUpdated(data.updated),
    light: data.light,
    html: String(processed),
    raw: content,
  };
}
