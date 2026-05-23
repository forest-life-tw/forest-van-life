"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { BuildStatusResponse, DeploymentStatus } from "@/app/api/admin/build-status/route";
import { isRecentBuild, BUILD_EVENT } from "@/lib/build-signal";

const ACTIVE_STATES: DeploymentStatus[] = ["QUEUED", "BUILDING"];
const POLL_ACTIVE = 5_000;
const POLL_IDLE = 30_000;
const READY_DISMISS_MS = 12_000;
const FORCE_FAST_MS = 3 * 60 * 1000;

export default function BuildStatus() {
  const [status, setStatus] = useState<DeploymentStatus>("UNKNOWN");
  const [showReady, setShowReady] = useState(false);
  const [fastUntil, setFastUntil] = useState(0);
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const poll = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/build-status");
      if (!res.ok) return;
      const data: BuildStatusResponse = await res.json();
      setStatus((prev) => {
        if (data.status === "READY" && ACTIVE_STATES.includes(prev)) {
          setShowReady(true);
          if (dismissTimer.current) clearTimeout(dismissTimer.current);
          dismissTimer.current = setTimeout(() => setShowReady(false), READY_DISMISS_MS);
        }
        return data.status;
      });
    } catch {
      // 網路錯誤靜默忽略
    }
  }, []);

  // 立刻切換 fast-poll：收到 build 觸發事件
  useEffect(() => {
    const handle = () => {
      setFastUntil(Date.now() + FORCE_FAST_MS);
      poll();
    };
    window.addEventListener(BUILD_EVENT, handle);
    return () => window.removeEventListener(BUILD_EVENT, handle);
  }, [poll]);

  // 輪詢排程：status 或 fastUntil 改變時重設 interval
  useEffect(() => {
    poll();
    const fast =
      ACTIVE_STATES.includes(status) || isRecentBuild() || Date.now() < fastUntil;
    const id = setInterval(poll, fast ? POLL_ACTIVE : POLL_IDLE);
    return () => clearInterval(id);
  }, [poll, status, fastUntil]);

  useEffect(() => {
    return () => { if (dismissTimer.current) clearTimeout(dismissTimer.current); };
  }, []);

  const isBuilding = ACTIVE_STATES.includes(status);
  const visible = isBuilding || (status === "READY" && showReady) || status === "ERROR";
  if (!visible) return null;

  return (
    <div
      className={`mx-3 mb-3 rounded-lg px-3 py-2.5 text-xs font-medium transition-all ${
        isBuilding
          ? "border border-amber-200 bg-amber-50 text-amber-800"
          : status === "ERROR"
          ? "border border-rose-200 bg-rose-50 text-rose-800"
          : "border border-emerald-200 bg-emerald-50 text-emerald-800"
      }`}
    >
      {isBuilding && (
        <div className="flex items-center gap-2">
          <Spinner />
          <div>
            <p>Vercel 建置中</p>
            <p className="mt-0.5 font-normal opacity-75">約 1 分鐘後前台生效</p>
          </div>
        </div>
      )}
      {status === "READY" && showReady && (
        <div className="flex items-center gap-2">
          <span>✅</span>
          <div>
            <p>前台已更新</p>
            <p className="mt-0.5 font-normal opacity-75">forest-van-life.vercel.app</p>
          </div>
        </div>
      )}
      {status === "ERROR" && (
        <div className="flex items-center gap-2">
          <span>⚠️</span>
          <div>
            <p>建置失敗</p>
            <p className="mt-0.5 font-normal opacity-75">請至 Vercel 查看 log</p>
          </div>
        </div>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <svg
      className="size-4 shrink-0 animate-spin text-amber-600"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}
