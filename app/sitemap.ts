import type { MetadataRoute } from "next";
import { DEMO_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: DEMO_URL, changeFrequency: "monthly", priority: 1 }];
}
