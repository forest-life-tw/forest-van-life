"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import BuildStatus from "@/components/admin/BuildStatus";

const NAV = [
  { href: "/admin", label: "總覽", icon: "▤" },
  { href: "/admin/articles", label: "文章管理", icon: "✎" },
  { href: "/admin/news", label: "露營大小事", icon: "📰" },
  { href: "/admin/cars", label: "車型管理", icon: "🚐" },
  { href: "/admin/settings", label: "網站設定", icon: "⚙" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  }

  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <div className="flex min-h-screen bg-stone-100">
      {/* Sidebar */}
      <aside className="flex w-56 flex-col border-r border-stone-200 bg-white">
        <div className="flex items-center gap-2 border-b border-stone-200 p-4">
          <Image src="/logo.png" alt="森活家" width={100} height={73} className="h-8 w-auto" />
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {NAV.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <BuildStatus />
        <div className="border-t border-stone-200 p-3">
          <button
            onClick={logout}
            className="w-full rounded-lg px-3 py-2 text-left text-sm text-stone-500 hover:bg-stone-100 hover:text-stone-700"
          >
            登出
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  );
}
