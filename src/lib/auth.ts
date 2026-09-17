import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export const COOKIE_NAME = "fvl_admin";

/** ADMIN_JWT_SECRET 有沒有設定。給登入 API 用來回明確的設定錯誤訊息。 */
export function isJwtSecretConfigured(): boolean {
  return Boolean(process.env.ADMIN_JWT_SECRET);
}

/**
 * 取簽章用的密鑰。
 *
 * 刻意「用到才取」而不是在模組載入時就算好：這個檔案被 src/proxy.ts
 * import，而 proxy 是全站層級的入口，在模組載入時丟錯有可能讓 build
 * 失敗或整個網站（含前台）掛掉。改成延後求值之後，設定缺失只會讓後台
 * 登入失效，前台完全不受影響。
 *
 * 這裡「沒設定就丟錯」是刻意的，不要為了方便加上預設值——舊版寫成
 * `process.env.ADMIN_JWT_SECRET || "forest-van-life-change-in-prod"`，
 * 那個備用字串隨著 repo 公開等於全世界都看得到，任何漏設這個變數的
 * 環境都會默默改用它，而簽章密鑰一旦外洩，別人就能自行偽造合法的
 * 管理員 cookie，完全繞過密碼。
 */
function getSecret(): Uint8Array {
  const raw = process.env.ADMIN_JWT_SECRET;
  if (!raw) {
    throw new Error(
      "ADMIN_JWT_SECRET 未設定：請到 Vercel 專案的 Environment Variables 補上，並確認有勾選目前這個環境"
    );
  }
  return new TextEncoder().encode(raw);
}

export async function createAdminToken(): Promise<string> {
  return new SignJWT({ admin: true })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(getSecret());
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, getSecret());
    return true;
  } catch {
    // 含「密鑰未設定」的情況：一律當作驗證失敗，寧可擋下也不要放行
    return false;
  }
}

export async function getAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return verifyAdminToken(token);
}
