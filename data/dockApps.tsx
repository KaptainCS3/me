import { FiUser, FiFolder, FiZap, FiMail, FiTerminal } from "react-icons/fi"
import type { DockApp } from "@/types/portfolio"

export const DOCK_APPS: DockApp[] = [
  { id: "about", icon: <FiUser />, label: "About" },
  { id: "projects", icon: <FiFolder />, label: "Projects" },
  { id: "skills", icon: <FiZap />, label: "Skills" },
  { id: "contact", icon: <FiMail />, label: "Contact" },
  { id: "terminal", icon: <FiTerminal />, label: "Terminal" },
  // { id: "settings", icon: <FiSettings />, label: "Settings" },
  // { id: "snipping-tool", icon: <FiCamera />, label: "Snipping Tool" },
]

