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
    default: "森活家露營車 | 合法廂車改裝專家",
    template: "%s | 森活家露營車",
  },
  description:
    "森活家露營車，專注貨車、客貨車的合法露營改裝。座位變更、車頂置物架、副電池、駐車冷氣，每一項對應法規依據，過得了驗車。",
  openGraph: {
    type: "website",
    locale: "zh_TW",
    siteName: "森活家露營車",
    title: "森活家露營車 | 合法廂車改裝專家",
    description:
      "台灣合法廂車改裝廠，所有施作對應法規依據、協助監理站變更登記，驗車保過。",
    images: [
      {
        url: "/logo.png",
        width: 276,
        height: 202,
        alt: "森活家露營車",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "森活家露營車 | 合法廂車改裝專家",
    description:
      "台灣合法廂車改裝廠，所有施作對應法規依據、協助監理站變更登記，驗車保過。",
    images: ["/logo.png"],
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
