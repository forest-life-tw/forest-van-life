import { NextResponse } from "next/server";
import { createAdminToken, COOKIE_NAME } from "@/lib/auth";

export async function GET() {
  return NextResponse.json({
    pwd_set: !!process.env.ADMIN_PASSWORD,
    pwd_len: process.env.ADMIN_PASSWORD?.length ?? 0,
    test_match: process.env.ADMIN_PASSWORD === "ForestLife",
  });
}

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = await createAdminToken();
    const res = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
    return res;
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(COOKIE_NAME);
  return res;
}
