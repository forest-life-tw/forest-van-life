import { MetadataRoute } from "next";
import { getSiteConfig } from "@/lib/config";
import { listDocs } from "@/lib/markdown";

const BASE_URL = "https://forest-van-life.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const config = getSiteConfig();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, priority: 1.0, changeFrequency: "weekly" },
    { url: `${BASE_URL}/laws`, priority: 0.9, changeFrequency: "weekly" },
    { url: `${BASE_URL}/cars`, priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE_URL}/news`, priority: 0.8, changeFrequency: "weekly" },
    { url: `${BASE_URL}/about`, priority: 0.6, changeFrequency: "monthly" },
  ];

  const lawDocs = [
    ...listDocs("laws"),
    ...listDocs("design"),
    ...listDocs("others"),
  ].map((doc) => ({
    url: `${BASE_URL}/laws/${doc.slug}`,
    lastModified: doc.updated ? new Date(doc.updated) : undefined,
    priority: 0.85,
    changeFrequency: "monthly" as const,
  }));

  const carPages = config.cars.map((car) => ({
    url: `${BASE_URL}/cars/${car.slug}`,
    priority: 0.75,
    changeFrequency: "monthly" as const,
  }));

  return [...staticPages, ...lawDocs, ...carPages];
}
