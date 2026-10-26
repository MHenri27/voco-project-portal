import type { MetadataRoute } from "next";

// It's a private catalog, so keep every crawler out across the whole site.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: "/",
    },
  };
}
