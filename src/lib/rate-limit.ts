/**
 * 後台登入失敗次數限制。
 *
 * 規則（使用者 2026-09-09 指定）：
 * - 同一來源 IP 在 30 分鐘內連續失敗 3 次 → 從第 3 次失敗起鎖定 2 小時
 * - 鎖定期滿自動解除，重新獲得 3 次機會
 * - 登入成功立即清空該 IP 的紀錄
 *
 * 儲存方式是「單一 serverless 實例的記憶體」，不是共用資料庫。
 * 代價：Vercel 冷啟動或換到另一個實例時計數會歸零，擋不住刻意分散、
 * 低頻率的攻擊。但對「腳本連續猛打同一支 API」這個實際威脅足夠有效，
 * 且不需要額外服務。若之後要真正嚴謹，把 hit()/reset() 換成
 * Vercel KV / Upstash 這類共用儲存即可，呼叫端不用改。
 *
 * 附帶好處：重新部署一次就會清空所有鎖定，等於內建的自救出口
 * （管理者自己被鎖住又不想等 2 小時時可用）。
 */

const WINDOW_MS = 30 * 60 * 1000; // 30 分鐘內累計失敗次數
const MAX_FAILURES = 3; // 累計到這個次數就鎖定
const LOCK_MS = 2 * 60 * 60 * 1000; // 鎖定 2 小時
const MAX_ENTRIES = 5000; // 記憶體上限，避免被大量偽造 IP 灌爆

type Entry = {
  /** 視窗內的失敗時間戳（毫秒） */
  failures: number[];
  /** 鎖定到期時間戳（毫秒），null 表示未鎖定 */
  lockedUntil: number | null;
};

const store = new Map<string, Entry>();

/** 清掉已經沒有意義的紀錄（沒鎖定、且視窗內沒有失敗） */
function sweep(now: number) {
  for (const [key, entry] of store) {
    const locked = entry.lockedUntil !== null && entry.lockedUntil > now;
    const recent = entry.failures.some((t) => now - t < WINDOW_MS);
    if (!locked && !recent) store.delete(key);
  }
}

export type RateLimitStatus =
  | { blocked: false; remaining: number }
  | { blocked: true; retryAfterMs: number };

/**
 * 檢查某個來源目前能不能嘗試登入。不會累計次數，純查詢。
 */
export function check(key: string): RateLimitStatus {
  const now = Date.now();
  const entry = store.get(key);
  if (!entry) return { blocked: false, remaining: MAX_FAILURES };

  if (entry.lockedUntil !== null) {
    if (entry.lockedUntil > now) {
      return { blocked: true, retryAfterMs: entry.lockedUntil - now };
    }
    // 鎖定期已過，重置後放行
    entry.lockedUntil = null;
    entry.failures = [];
  }

  const recent = entry.failures.filter((t) => now - t < WINDOW_MS);
  entry.failures = recent;
  return { blocked: false, remaining: Math.max(0, MAX_FAILURES - recent.length) };
}

/**
 * 記錄一次失敗。回傳記錄之後的狀態（可能因此進入鎖定）。
 */
export function hit(key: string): RateLimitStatus {
  const now = Date.now();

  if (store.size > MAX_ENTRIES) sweep(now);

  const entry = store.get(key) ?? { failures: [], lockedUntil: null };

  // 鎖定中就不再累加，直接回報剩餘時間
  if (entry.lockedUntil !== null && entry.lockedUntil > now) {
    store.set(key, entry);
    return { blocked: true, retryAfterMs: entry.lockedUntil - now };
  }

  const recent = entry.failures.filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  entry.failures = recent;
  entry.lockedUntil = null;

  if (recent.length >= MAX_FAILURES) {
    // 從「最後一次失敗」起算 2 小時
    entry.lockedUntil = now + LOCK_MS;
    entry.failures = [];
    store.set(key, entry);
    return { blocked: true, retryAfterMs: LOCK_MS };
  }

  store.set(key, entry);
  return { blocked: false, remaining: MAX_FAILURES - recent.length };
}

/** 登入成功後清空該來源的失敗紀錄。 */
export function reset(key: string) {
  store.delete(key);
}

/**
 * 取得請求來源識別。Vercel 會帶 x-forwarded-for（最左邊是真實訪客 IP）。
 * 取不到時回退成固定字串——寧可讓所有匿名來源共用一組計數（偏嚴），
 * 也不要因為拿不到 IP 就完全不設限。
 */
export function clientKey(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}

/** 把毫秒轉成中文的「X 小時 Y 分鐘」，給前端訊息用。 */
export function formatWait(ms: number): string {
  const totalMinutes = Math.max(1, Math.ceil(ms / 60000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0) return minutes > 0 ? `${hours} 小時 ${minutes} 分鐘` : `${hours} 小時`;
  return `${minutes} 分鐘`;
}
