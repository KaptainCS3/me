import type { Project } from "@/types/portfolio"

export const PROJECTS: Project[] = [
  {
    name: "Cameroon Homestay Agency",
    tech: ["React", "Vite", "TypeScript", "i18n"],
    desc: "Full bilingual EN/FR platform with translated URL slugs, WhatsApp booking deeplinks, and reusable component architecture.",
    color: "#1a6b4a",
    accent: "#34d399",
  },
  {
    name: "CADI — Central African Diving",
    tech: ["React", "Vite", "TypeScript", "SEO"],
    desc: "22-page, 35-component site with dark maritime aesthetic, full EN/FR i18n, JSON-LD structured data, and 7-phase build plan.",
    color: "#0c3d6b",
    accent: "#60a5fa",
  },
  {
    name: "Global Bush Travel",
    tech: ["React", "Vite", "Tailwind", "Blog"],
    desc: "13+ service pages, dynamic location/tour pages, AI blog writing agent, and bilingual EN/FR routing with fully translated slugs.",
    color: "#4a2a0a",
    accent: "#fb923c",
  },
  {
    name: "IELTS Prep App",
    tech: ["React Native", "Expo", "Supabase", "SQLCipher"],
    desc: "AI-powered mobile app with Supabase Edge Functions proxy, SQLCipher encryption, OWASP Mobile Top 10 security audit.",
    color: "#2a0a4a",
    accent: "#c084fc",
  },
]
