import fs from "node:fs";
import path from "node:path";

const CONFIG_PATH = path.join(process.cwd(), "content/site-config.json");

export type Feature = { icon: string; title: string; desc: string };
export type CarImageGroup = { name: string; images: string[] };
export type Model3dItem = { label: string; url: string };

export type SiteConfig = {
  logo: string;
  articleTags?: string[];
  homepage: {
    heroTitle: string;
    heroSubtitle: string;
    features: Feature[];
  };
  contact: {
    address: string;
    lineUrl: string;
    businessHours: string;
  };
  about: {
    intro: string[];
    services: string[];
    consultationTitle: string;
    consultationDesc: string;
    consultationSteps: string[];
  };
  cars: {
    slug: string;
    name: string;
    note: string;
    description: string;
    images: string[];
    imageGroups: CarImageGroup[];
    model3d?: string;
    model3dItems?: Model3dItem[];
  }[];
};

export function getSiteConfig(): SiteConfig {
  const raw = fs.readFileSync(CONFIG_PATH, "utf8");
  return JSON.parse(raw);
}
