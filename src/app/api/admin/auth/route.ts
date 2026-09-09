import { NextResponse } from "next/server";
import { createAdminToken, COOKIE_NAME } from "@/lib/auth";
import { check, hit, reset, clientKey, formatWait } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const key = clientKey(req);

    // 先看有沒有被鎖定，鎖定中連密碼都不比對
    const status = check(key);
    if (status.blocked) {
      return NextResponse.json(
        {
          error: "TOO_MANY_ATTEMPTS",
          message: `登入失敗次數過多，請於 ${formatWait(status.retryAfterMs)}後再試`,
          retryAfterMs: status.retryAfterMs,
        },
        {
          status: 429,
          headers: { "Retry-After": String(Math.ceil(status.retryAfterMs / 1000)) },
        }
      );
    }

    const expected = process.env.ADMIN_PASSWORD;
    if (!expected) {
      // 沒設定密碼就不能放行——否則送出空密碼會意外通過比對
      console.error("[admin/auth] ADMIN_PASSWORD 未設定，拒絕所有登入");
      return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
    }

    const { password } = await req.json();

    if (typeof password !== "string" || password !== expected) {
      const after = hit(key);
      if (after.blocked) {
        return NextResponse.json(
          {
            error: "TOO_MANY_ATTEMPTS",
            message: `登入失敗次數過多，請於 ${formatWait(after.retryAfterMs)}後再試`,
            retryAfterMs: after.retryAfterMs,
          },
          {
            status: 429,
            headers: { "Retry-After": String(Math.ceil(after.retryAfterMs / 1000)) },
          }
        );
      }
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: `密碼錯誤，還可以嘗試 ${after.remaining} 次`,
          remaining: after.remaining,
        },
        { status: 401 }
      );
    }

    reset(key);
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
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(COOKIE_NAME);
  return res;
}
