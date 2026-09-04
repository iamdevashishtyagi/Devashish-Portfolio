import type { MetadataRoute } from "next";
import { projects } from "@/src/app/data/profile";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://iamdevashishtyagi.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const projectImages = projects.flatMap((p) =>
    p.images.map((img) => `${siteUrl}${img.src}`)
  );

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
      images: [`${siteUrl}/opengraph-image`, ...projectImages],
    },
  ];
}
