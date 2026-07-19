import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file") as File;
  const type = form.get("type") as string | null;
  const carSlug = form.get("carSlug") as string | null;
  const productSlug = form.get("productSlug") as string | null;

  if (!file) return NextResponse.json({ error: "no file" }, { status: 400 });

  const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase();
  let filename: string;

  if (type === "logo") {
    filename = `logo/logo.${ext}`;
  } else if (type === "model3d" && carSlug) {
    filename = `cars/${carSlug}/model3d-${Date.now()}.glb`;
  } else if (carSlug) {
    const groupName = form.get("groupName") as string | null;
    const safeGroup = groupName ? groupName.replace(/[/\\?%*:|"<>]/g, "").trim() : "";
    filename = safeGroup
      ? `cars/${carSlug}/${safeGroup}-${Date.now()}.${ext}`
      : `cars/${carSlug}/${Date.now()}.${ext}`;
  } else if (productSlug) {
    filename = `products/${productSlug}/${Date.now()}.${ext}`;
  } else {
    return NextResponse.json({ error: "missing type or carSlug" }, { status: 400 });
  }

  try {
    const blob = await put(filename, file, {
      access: "public",
      allowOverwrite: type === "logo",
    });
    const url = type === "logo" ? `${blob.url}?v=${Date.now()}` : blob.url;
    return NextResponse.json({ url });
  } catch (err) {
    console.error("Blob upload error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export const maxDuration = 60;
