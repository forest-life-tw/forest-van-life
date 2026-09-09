"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  // "wrong" = 密碼錯誤；"locked" = 失敗次數過多被鎖定；"config" = 環境變數沒設好
  const [errorKind, setErrorKind] = useState<"wrong" | "locked" | "config">("wrong");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setErrorKind("wrong");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.push("/admin");
        return;
      }
      // 後端會回傳剩餘次數、鎖定時間或設定錯誤說明，直接顯示給管理者看
      const data = await res.json().catch(() => null);
      const kind = res.status === 429 ? "locked" : res.status >= 500 ? "config" : "wrong";
      setErrorKind(kind);
      setError(
        data?.message ||
          (kind === "locked"
            ? "登入失敗次數過多，請稍後再試"
            : kind === "config"
              ? "伺服器設定有誤，請檢查環境變數"
              : "密碼錯誤")
      );
    } catch {
      setErrorKind("config");
      setError("連線失敗，請稍後再試");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-100">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-md">
        <div className="mb-8 flex flex-col items-center gap-3">
          <Image src="/logo.png" alt="森活家露營車" width={140} height={103} className="h-14 w-auto" />
          <p className="text-sm text-stone-500">後台管理系統</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">管理員密碼</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  // 讓管理者鎖定期滿後不用重整頁面就能再試（真正的把關在後端）
                  if (errorKind === "locked") setErrorKind("wrong");
                }}
                className="w-full rounded-lg border border-stone-300 px-4 py-2.5 pr-16 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                placeholder="請輸入密碼"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-stone-500 hover:text-emerald-700"
                tabIndex={-1}
              >
                {showPassword ? "隱藏" : "顯示"}
              </button>
            </div>
          </div>
          {error &&
            (errorKind === "wrong" ? (
              <p className="text-sm text-rose-600">{error}</p>
            ) : (
              <div className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2.5">
                <p className="text-sm font-medium text-amber-900">
                  {errorKind === "locked" ? "帳號已暫時鎖定" : "此環境尚未設定完成"}
                </p>
                <p className="mt-1 text-sm text-amber-800">{error}</p>
              </div>
            ))}
          <button
            type="submit"
            disabled={loading || errorKind === "locked"}
            className="w-full rounded-lg bg-emerald-700 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-800 disabled:opacity-50"
          >
            {loading ? "登入中..." : "登入"}
          </button>
        </form>
      </div>
    </div>
  );
}
