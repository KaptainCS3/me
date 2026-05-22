import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "KaptainCS3 Portfolio",
    short_name: "KaptainCS3",
    description:
      "Portfolio of Mbi Enow Leonard Appelgryn, a full-stack software engineer.",
    start_url: "/",
    display: "standalone",
    background_color: "#050a12",
    theme_color: "#34d399",
  }
}
