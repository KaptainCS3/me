import { FiUser, FiFolder, FiZap, FiMail, FiMonitor, FiSettings, FiInfo, FiFile, FiCode, FiCamera } from "react-icons/fi"
import type { WindowConfig } from "@/types/portfolio"

export const WINDOW_CONFIGS: Record<string, WindowConfig> = {
  about: {
    title: "About.md",
    icon: <FiUser />,
    w: 520,
    h: 400,
    content: "about",
  },
  projects: {
    title: "Projects — ~/portfolio",
    icon: <FiFolder />,
    w: 700,
    h: 540,
    content: "projects",
  },
  skills: {
    title: "Skills.json",
    icon: <FiZap />,
    w: 480,
    h: 420,
    content: "skills",
  },
  contact: {
    title: "Contact",
    icon: <FiMail />,
    w: 580,
    h: 480,
    content: "contact",
  },
  terminal: {
    title: "bash — kaptain@portfolio",
    icon: <FiMonitor />,
    w: 540,
    h: 360,
    content: "terminal",
  },
  settings: {
    title: "Settings",
    icon: <FiSettings />,
    w: 500,
    h: 550,
    content: "settings",
  },
  "about-os": {
    title: "About PortfolioOS",
    icon: <FiInfo />,
    w: 420,
    h: 300,
    content: "about-os",
  },
  "resume-viewer": {
    title: "Resume.pdf",
    icon: <FiFile />,
    w: 700,
    h: 550,
    content: "resume-viewer",
  },
  "source-viewer": {
    title: "Source Inspector",
    icon: <FiCode />,
    w: 800,
    h: 500,
    content: "source-viewer",
  },
  "snipping-tool": {
    title: "Snipping Tool",
    icon: <FiCamera />,
    w: 400,
    h: 500,
    content: "snipping-tool",
  },
}
