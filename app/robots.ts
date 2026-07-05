import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/api",
        "/logg-inn",
        "/handlekurv",
        "/min-liste",
        "/ordre-bekreftet",
      ],
    },
    sitemap: "https://gundiengros.no/sitemap.xml",
  };
}
