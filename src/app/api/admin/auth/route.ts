import { NextResponse } from "next/server";
import { createAdminToken, COOKIE_NAME, isJwtSecretConfigured } from "@/lib/auth";
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

    // 缺任一個都不能放行。ADMIN_PASSWORD 缺失時若不擋，送出不含 password
    // 欄位的請求會因為 undefined === undefined 而通過比對；ADMIN_JWT_SECRET
    // 缺失則簽不出憑證。兩者都是環境設定問題不是密碼錯誤，訊息要講清楚，
    // 否則管理者會以為自己打錯而一直重打。
    const missing: string[] = [];
    if (!process.env.ADMIN_PASSWORD) missing.push("ADMIN_PASSWORD");
    if (!isJwtSecretConfigured()) missing.push("ADMIN_JWT_SECRET");
    if (missing.length > 0) {
      console.error(`[admin/auth] ${missing.join("、")} 未設定，拒絕所有登入`);
      return NextResponse.json(
        {
          error: "NOT_CONFIGURED",
          message: `此環境尚未設定 ${missing.join("、")}，無法登入。請到 Vercel 專案設定的 Environment Variables 補上，並確認有勾選目前這個環境。`,
        },
        { status: 500 }
      );
    }
    const expected = process.env.ADMIN_PASSWORD;

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
