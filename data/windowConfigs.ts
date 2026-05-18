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
    w: 620,
    h: 480,
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
    h: 340,
    content: "contact",
  },
  terminal: {
    title: "bash — kaptain@portfolio",
    icon: "🖥️",
    w: 540,
    h: 360,
    content: "terminal",
  },
}
