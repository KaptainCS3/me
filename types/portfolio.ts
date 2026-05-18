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
}

export interface SkillCategory {
  cat: string
  items: string[]
}

export interface TerminalLine {
  ps?: boolean
  cmd?: string
  out?: string
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
