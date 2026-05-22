import type { ReactNode } from "react"

export interface DockApp {
  id: string
  icon: ReactNode
  label: string
}

export interface Project {
  name: string
  tech: string[]
  desc: string
  color: string
  accent: string
  stack?: string[]
  skills?: string[]
  url?: string
  github?: string
  period?: string
  metrics?: string[]
  context?: string
  type?: "web" | "mobile" | "api"
  isCompany?: boolean
  iframeBlocked?: boolean
}

export interface SkillCategory {
  cat: string
  items: string[]
  level?: number
  icon?: ReactNode
}

export interface TerminalLine {
  ps?: boolean
  cmd?: string
  out?: string
  color?: string
  flag?: string
}

export interface WindowConfig {
  title: string
  icon: ReactNode
  w: number
  h: number
  content: string
}

export interface WindowState {
  pos: { x: number; y: number }
  minimized: boolean
  z: number
}

export interface WallpaperPreset {
  id: string
  name: string
  value: string
}

export interface FileMeta {
  name: string
  size: number
  type: string
  dataUrl?: string
  thumbnail?: string
  storageId?: string
}

export interface VfsNode {
  type: "file" | "dir"
  content?: string
  children?: string[]
}

export interface DesktopItem {
  id: string
  icon: string
  label: string
  x: number
  y: number
  vfsPath?: string
  fileMeta?: FileMeta
}
