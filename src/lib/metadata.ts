import type { Metadata } from "next";

export const SITE_URL = "https://forest-van-life.vercel.app";
export const SITE_NAME = "森活家露營車";

export function pageMetadata(path: string, title: string, description: string, image = "/og-image.png", article = false): Metadata {
  const url = new URL(path, SITE_URL).href;
  const shareTitle = `${title}｜${SITE_NAME}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: article ? "article" : "website",
      locale: "zh_TW",
      siteName: SITE_NAME,
      url,
      title: shareTitle,
      description,
      images: [{ url: new URL(image, SITE_URL).href, alt: shareTitle }],
    },
    twitter: { card: "summary_large_image", title: shareTitle, description, images: [new URL(image, SITE_URL).href] },
  };
}
