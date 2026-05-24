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
    default: "森活家露營車｜廂車改裝量身客製，安全施工・品質嚴選，Hiace、Staria、Caddy、Combo",
    template: "%s | 森活家露營車",
  },
  description:
    "每道工序嚴格把關、品質全程可追溯。Hiace、Staria、Caddy、Combo、J-Space 都有完整客製案例，依你的車型與使用習慣量身規劃，從選材、木作、電系到臥鋪配置，打造安全耐用、真正符合你旅行方式的移動空間。",
  openGraph: {
    type: "website",
    locale: "zh_TW",
    siteName: "森活家露營車",
    title: "森活家露營車｜廂車改裝量身客製，安全施工・品質嚴選，Hiace、Staria、Caddy、Combo",
    description:
      "每道工序嚴格把關、品質全程可追溯。Hiace、Staria、Caddy、Combo、J-Space 都有完整客製案例，依你的車型與使用習慣量身規劃，從選材、木作、電系到臥鋪配置，打造安全耐用、真正符合你旅行方式的移動空間。",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "森活家露營車｜廂車改裝量身客製",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "森活家露營車｜廂車改裝量身客製，安全施工・品質嚴選，Hiace、Staria、Caddy、Combo",
    description:
      "每道工序嚴格把關、品質全程可追溯。Hiace、Staria、Caddy、Combo、J-Space 都有完整客製案例，依你的車型與使用習慣量身規劃，從選材、木作、電系到臥鋪配置，打造安全耐用、真正符合你旅行方式的移動空間。",
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
