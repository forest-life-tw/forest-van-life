const KEY = "fvl_build_ts";
const WINDOW_MS = 2 * 60 * 1000;

export function markBuildTriggered(): void {
  try { localStorage.setItem(KEY, String(Date.now())); } catch {}
}

export function isRecentBuild(): boolean {
  try {
    const ts = parseInt(localStorage.getItem(KEY) ?? "0", 10);
    return Date.now() - ts < WINDOW_MS;
  } catch { return false; }
}
