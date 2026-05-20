export interface DockApp {
  id: string
  icon: string
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
}

export interface SkillCategory {
  cat: string
  items: string[]
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
  icon: string
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
  fileMeta?: FileMeta
}
