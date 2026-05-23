import Link from "next/link";
import Image from "next/image";
import { getSiteConfig } from "@/lib/config";

const NAV = [
  { href: "/laws", label: "常見問題 Knowhow" },
  { href: "/cars", label: "車型專區" },
  { href: "/about", label: "關於我們" },
];

export default function Header() {
  const { logo } = getSiteConfig();

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src={logo} alt="森活家露營車" width={276} height={202} className="h-10 w-auto" priority unoptimized={logo.startsWith("http")} />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-100 hover:text-emerald-700"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/about#contact"
            className="ml-2 rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-800"
          >
            預約諮詢
          </Link>
        </nav>

        <details className="relative md:hidden">
          <summary className="cursor-pointer list-none rounded-md p-2 text-stone-700 hover:bg-stone-100">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </summary>
          <div className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-stone-200 bg-white p-2 shadow-lg">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-md px-3 py-2 text-sm text-stone-700 hover:bg-stone-100"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/about#contact"
              className="mt-1 block rounded-md bg-emerald-700 px-3 py-2 text-center text-sm font-medium text-white"
            >
              預約諮詢
            </Link>
          </div>
        </details>
      </div>
    </header>
  );
}
