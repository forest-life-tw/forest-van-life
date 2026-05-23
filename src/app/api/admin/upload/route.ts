import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file") as File;
  const type = form.get("type") as string | null;
  const carSlug = form.get("carSlug") as string | null;

  if (!file) return NextResponse.json({ error: "no file" }, { status: 400 });

  const ext = file.name.split(".").pop() ?? "jpg";
  let filename: string;

  if (type === "logo") {
    filename = `logo/logo.${ext}`;
  } else if (carSlug) {
    const groupName = form.get("groupName") as string | null;
    const safeGroup = groupName ? groupName.replace(/[/\\?%*:|"<>]/g, "").trim() : "";
    filename = safeGroup
      ? `cars/${carSlug}/${safeGroup}-${Date.now()}.${ext}`
      : `cars/${carSlug}/${Date.now()}.${ext}`;
  } else {
    return NextResponse.json({ error: "missing type or carSlug" }, { status: 400 });
  }

  const blob = await put(filename, file, { access: "public" });
  return NextResponse.json({ url: blob.url });
}
