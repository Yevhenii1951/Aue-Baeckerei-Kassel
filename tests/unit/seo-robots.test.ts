import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import { SITE_URL } from "@/features/seo/site";

describe("crawler policy", () => {
  it("blocks the admin area and the internal API surface", () => {
    expect(robots()).toEqual({
      rules: {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/*/admin"],
      },
      sitemap: `${SITE_URL}/sitemap.xml`,
    });
  });
});
