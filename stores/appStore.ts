import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { WindowState, DesktopItem } from "@/types/portfolio"

const DEFAULT_DESKTOP_ITEMS: DesktopItem[] = [
  { id: "resume", icon: "📄", label: "Resume.pdf", x: 0, y: 32 },
  { id: "about", icon: "👤", label: "About.md", x: 0, y: 116 },
]

interface AppStore {
  windows: Record<string, WindowState>
  zCounter: number
  focusedWindow: string | null
  desktopItems: DesktopItem[]

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
      }),
    },
  ),
)
