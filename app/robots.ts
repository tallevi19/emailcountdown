import { MetadataRoute } from "next";

const BASE_URL =
  process.env.NEXTAUTH_URL ?? "https://emailcountdown.net";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/dashboard/", "/timers/", "/billing/", "/settings/", "/admin/"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
