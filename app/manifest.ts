import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nepali Directory",
    short_name: "Nepali Directory",
    description:
      "Find, compare and contact local businesses, restaurants, doctors, hotels and services across Nepal.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffd400",
    categories: ["business", "travel", "food", "medical", "utilities"],
    lang: "en",
    icons: [
      {
        src: "/icon.svg",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "any"
      },
      {
        src: "/logo.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "any"
      }
    ]
  };
}
