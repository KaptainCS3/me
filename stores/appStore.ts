import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { WindowState, DesktopItem, VfsNode } from "@/types/portfolio"

const DEFAULT_DESKTOP_ITEMS: DesktopItem[] = [
  { id: "resume", icon: "📄", label: "Resume.pdf", x: 0, y: 32, vfsPath: "/home/appelgryn/about.md", fileMeta: {type: 'application/pdf', name: 'resume.pdf', size: 1028}},
  { id: "about", icon: "👤", label: "About.md", x: 0, y: 116, vfsPath: "/home/appelgryn/about/readme.md", fileMeta: {type: 'md', name: 'about.md', size: 512}},
]

interface AppStore {
  // Existing state
  windows: Record<string, WindowState>
  zCounter: number
  focusedWindow: string | null
  desktopItems: DesktopItem[]

  // New state
  isBooted: boolean
  accentColor: string
  themeMode: "dark" | "light" | "matrix" | "retro"
  isMuted: boolean
  vfs: Record<string, VfsNode>

  // Existing actions
  addWindow: (id: string, state: WindowState) => void
  removeWindow: (id: string) => void
  setWindowPos: (id: string, pos: { x: number; y: number }) => void
  setWindowMinimized: (id: string, minimized: boolean) => void
  setFocusedWindow: (id: string | null) => void
  focusWindow: (id: string) => void
  getNextZ: () => number
  setDesktopItems: (items: DesktopItem[]) => void
  mergeDesktopItems: (items: DesktopItem[]) => void
  moveDesktopItem: (id: string, x: number, y: number) => void
  updateDesktopItem: (id: string, update: Partial<DesktopItem>) => void

  // New actions
  setIsBooted: (booted: boolean) => void
  setAccentColor: (color: string) => void
  setThemeMode: (mode: "dark" | "light" | "matrix" | "retro") => void
  setIsMuted: (muted: boolean) => void
  setVfs: (vfs: Record<string, VfsNode>) => void
  updateVfsNode: (path: string, node: VfsNode) => void
  deleteVfsNode: (path: string) => void
}

function gridKey(x: number, y: number): string {
  return `${Math.round(x / 84) * 84},${Math.round(y / 84) * 84}`
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      windows: {},
      zCounter: 10,
      focusedWindow: null,
      desktopItems: DEFAULT_DESKTOP_ITEMS,

      isBooted: false,
      accentColor: "#34d399",
      themeMode: "dark",
      isMuted: false,
      vfs: {},

      addWindow: (id, state) =>
        set((s) => ({ windows: { ...s.windows, [id]: state } })),

      removeWindow: (id) =>
        set((s) => {
          const { [id]: _, ...rest } = s.windows
          return {
            windows: rest,
            focusedWindow: s.focusedWindow === id ? null : s.focusedWindow,
          }
        }),

      setWindowPos: (id, pos) =>
        set((s) => ({
          windows: s.windows[id]
            ? { ...s.windows, [id]: { ...s.windows[id], pos } }
            : s.windows,
        })),

      setWindowMinimized: (id, minimized) =>
        set((s) => ({
          windows: s.windows[id]
            ? { ...s.windows, [id]: { ...s.windows[id], minimized } }
            : s.windows,
        })),

      setFocusedWindow: (id) => set({ focusedWindow: id }),

      focusWindow: (id) =>
        set((s) => {
          const newZ = s.zCounter + 1
          return {
            focusedWindow: id,
            zCounter: newZ,
            windows: s.windows[id]
              ? { ...s.windows, [id]: { ...s.windows[id], z: newZ } }
              : s.windows,
          }
        }),

      getNextZ: () => {
        const z = get().zCounter + 1
        set({ zCounter: z })
        return z
      },

      setDesktopItems: (items) => set({ desktopItems: items }),

      mergeDesktopItems: (items) =>
        set((s) => {
          const existingCells = new Set(s.desktopItems.map((di) => gridKey(di.x, di.y)))
          return {
            desktopItems: [
              ...s.desktopItems,
              ...items.filter((ni) => {
                const cell = gridKey(ni.x, ni.y)
                if (existingCells.has(cell)) return false
                existingCells.add(cell)
                return true
              }),
            ],
          }
        }),

      moveDesktopItem: (id, x, y) =>
        set((s) => {
          const sx = Math.round(x / 84) * 84
          const sy = Math.round(y / 84) * 84
          const cell = gridKey(sx, sy)
          const taken = s.desktopItems.some(
            (item) => item.id !== id && gridKey(item.x, item.y) === cell,
          )
          if (taken) return s
          return {
            desktopItems: s.desktopItems.map((item) =>
              item.id === id ? { ...item, x: sx, y: sy } : item,
            ),
          }
        }),

      updateDesktopItem: (id, update) =>
        set((s) => ({
          desktopItems: s.desktopItems.map((item) =>
            item.id === id ? { ...item, ...update } : item,
          ),
        })),

      setIsBooted: (isBooted) => set({ isBooted }),
      setAccentColor: (accentColor) => set({ accentColor }),
      setThemeMode: (themeMode) => set({ themeMode }),
      setIsMuted: (isMuted) => set({ isMuted }),
      setVfs: (vfs) => set({ vfs }),
      updateVfsNode: (path, node) =>
        set((s) => ({ vfs: { ...s.vfs, [path]: node } })),
      deleteVfsNode: (path) =>
        set((s) => {
          const { [path]: _, ...rest } = s.vfs
          return { vfs: rest }
        }),
    }),
    {
      name: "portfolio-app-state",
      partialize: (state) => ({
        windows: state.windows,
        zCounter: state.zCounter,
        focusedWindow: state.focusedWindow,
        desktopItems: state.desktopItems.map((item) => ({
          ...item,
          fileMeta: item.fileMeta
            ? { name: item.fileMeta.name, size: item.fileMeta.size, type: item.fileMeta.type }
            : undefined,
        })),
        accentColor: state.accentColor,
        themeMode: state.themeMode,
        isMuted: state.isMuted,
        vfs: state.vfs,
      }),
    },
  ),
)
