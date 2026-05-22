const TOKEN = process.env.GITHUB_TOKEN!;
const OWNER = process.env.GITHUB_OWNER ?? "forest-life-tw";
const REPO = process.env.GITHUB_REPO ?? "forest-van-life";

const BASE = `https://api.github.com/repos/${OWNER}/${REPO}/contents`;

const headers = () => ({
  Authorization: `Bearer ${TOKEN}`,
  Accept: "application/vnd.github.v3+json",
  "Content-Type": "application/json",
});

export type GithubFile = { content: string; sha: string };

export async function ghRead(path: string): Promise<GithubFile | null> {
  const res = await fetch(`${BASE}/${path}`, {
    headers: headers(),
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = await res.json();
  return {
    content: Buffer.from(data.content, "base64").toString("utf-8"),
    sha: data.sha,
  };
}

export async function ghWrite(
  path: string,
  content: string,
  message: string,
  sha?: string
): Promise<boolean> {
  const body: Record<string, string> = {
    message,
    content: Buffer.from(content).toString("base64"),
  };
  if (sha) body.sha = sha;
  const res = await fetch(`${BASE}/${path}`, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify(body),
  });
  return res.ok;
}

export async function ghDelete(
  path: string,
  sha: string,
  message: string
): Promise<boolean> {
  const res = await fetch(`${BASE}/${path}`, {
    method: "DELETE",
    headers: headers(),
    body: JSON.stringify({ message, sha }),
  });
  return res.ok;
}
