import type { WindowConfig } from "@/types/portfolio"

export const WINDOW_CONFIGS: Record<string, WindowConfig> = {
  about: {
    title: "About.md",
    icon: "👤",
    w: 520,
    h: 400,
    content: "about",
  },
  projects: {
    title: "Projects — ~/portfolio",
    icon: "📁",
    w: 700,
    h: 540,
    content: "projects",
  },
  skills: {
    title: "Skills.json",
    icon: "⚡",
    w: 480,
    h: 420,
    content: "skills",
  },
  contact: {
    title: "Contact",
    icon: "✉️",
    w: 400,
    h: 380,
    content: "contact",
  },
  terminal: {
    title: "bash — kaptain@portfolio",
    icon: "🖥️",
    w: 540,
    h: 360,
    content: "terminal",
  },
  "about-os": {
    title: "About PortfolioOS",
    icon: "ℹ️",
    w: 420,
    h: 300,
    content: "about-os",
  },
  "resume-viewer": {
    title: "Resume.pdf",
    icon: "📄",
    w: 700,
    h: 550,
    content: "resume-viewer",
  },
}
