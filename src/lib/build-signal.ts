const KEY = "fvl_build_ts";
const WINDOW_MS = 2 * 60 * 1000;
const BUILD_EVENT = "fvl_build";

export function markBuildTriggered(): void {
  try {
    localStorage.setItem(KEY, String(Date.now()));
    window.dispatchEvent(new CustomEvent(BUILD_EVENT));
  } catch {}
}

export function isRecentBuild(): boolean {
  try {
    const ts = parseInt(localStorage.getItem(KEY) ?? "0", 10);
    return Date.now() - ts < WINDOW_MS;
  } catch { return false; }
}

export { BUILD_EVENT };
