import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NepaliDirectory",
    short_name: "NepaliDirectory",
    description:
      "Find, compare and contact local businesses, restaurants, doctors, hotels and services across Nepal.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0f1c2e",
    categories: ["business", "travel", "food", "medical", "utilities"],
    lang: "en",
    dir: "ltr",
    id: "/",
    shortcuts: [
      { name: "Browse categories", url: "/categories" },
      { name: "Browse cities", url: "/city" },
      { name: "Add your business", url: "/claim-listing" }
    ],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any"
      },
      {
        src: "/logo.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any"
      }
    ]
  };
}
