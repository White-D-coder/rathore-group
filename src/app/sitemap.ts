import type { MetadataRoute } from "next";
import { projects } from "@/data/company";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://rathore-group-legacy.keyursatra.chatgpt.site";
  return [
    "",
    "about/",
    "capabilities/",
    "projects/",
    "our-presence/",
    "leadership/",
    "contact/",
    ...projects.map((p) => `projects/${p.slug}/`),
  ].map((p) => ({
    url: `${base}/${p}`,
    changeFrequency: "monthly",
    priority: p ? 0.7 : 1,
  }));
}
