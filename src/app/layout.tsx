import type { Metadata } from "next";
import { Noto_Sans_TC } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const notoTC = Noto_Sans_TC({
  variable: "--font-noto-tc",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const BASE_URL = "https://forest-van-life.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "森活家露營車｜台灣合法廂車改裝廠，Hiace、Staria、Caddy 驗車保過",
    template: "%s | 森活家露營車",
  },
  description:
    "專注貨車、客貨車合法露營改裝。Hiace、Staria、Caddy、Combo、J-Space 皆有完整改裝案例。座位數變更、副電池系統、駐車冷氣、車頂置物架，每一項改裝對應法規依據，協助監理站變更登記，驗車過得了。",
  openGraph: {
    type: "website",
    locale: "zh_TW",
    siteName: "森活家露營車",
    title: "森活家露營車｜台灣合法廂車改裝廠，Hiace、Staria、Caddy 驗車保過",
    description:
      "專注貨車、客貨車合法露營改裝。Hiace、Staria、Caddy、Combo、J-Space 皆有完整改裝案例。座位數變更、副電池系統、駐車冷氣、車頂置物架，每一項改裝對應法規依據，協助監理站變更登記，驗車過得了。",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "森活家露營車｜台灣合法廂車改裝廠",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "森活家露營車｜台灣合法廂車改裝廠，Hiace、Staria、Caddy 驗車保過",
    description:
      "專注貨車、客貨車合法露營改裝。Hiace、Staria、Caddy、Combo、J-Space 皆有完整改裝案例。座位數變更、副電池系統、駐車冷氣、車頂置物架，每一項改裝對應法規依據，協助監理站變更登記，驗車過得了。",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant-TW" className={`${notoTC.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-white text-stone-900">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
