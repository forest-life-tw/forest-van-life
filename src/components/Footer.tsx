import Link from "next/link";
import Image from "next/image";
import { getSiteConfig } from "@/lib/config";

export default function Footer() {
  const { logo, contact } = getSiteConfig();
  const lineHandle = contact.lineUrl.match(/@[\w]+/)?.[0] ?? "LINE";

  return (
    <footer className="mt-24 border-t border-stone-200 bg-stone-50">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <Image src={logo} alt="森活家露營車" width={276} height={202} className="h-10 w-auto" unoptimized={logo.startsWith("http")} />
            </div>
            <p className="mt-3 max-w-md text-sm leading-6 text-stone-600">
              專注貨車、客貨車的合法露營改裝。所有施作對應法規依據，從座位變更、車內木作、副電池到駐車冷氣，每一項都查得到法源、過得了驗車。
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-stone-900">內容導覽</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/laws" className="text-stone-600 hover:text-emerald-700">常見問題 Knowhow</Link></li>
              <li><Link href="/cars" className="text-stone-600 hover:text-emerald-700">車型專區</Link></li>
              <li><Link href="/about" className="text-stone-600 hover:text-emerald-700">關於我們</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-stone-900">聯繫</h4>
            <ul className="space-y-2 text-sm text-stone-600">
              {contact.address && <li>地址：{contact.address}</li>}
              {contact.businessHours && <li>營業時間：{contact.businessHours}</li>}
              {contact.lineUrl && (
                <li>
                  <a
                    href={contact.lineUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-emerald-700"
                  >
                    LINE：{lineHandle}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-2 border-t border-stone-200 pt-6 text-xs text-stone-500 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} 森活家露營車. All rights reserved.</p>
          <p>本站內容僅供參考，實際法規以主管機關公告為準。</p>
        </div>
      </div>
    </footer>
  );
}
