import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { TerminalLine } from "@/types/portfolio"

interface TerminalStore {
  lines: TerminalLine[]
  idx: number
  history: string[]

  addBootLine: (line: TerminalLine) => void
  advanceBoot: (idx: number) => void
  addLine: (line: TerminalLine) => void
  addLines: (lines: TerminalLine[]) => void
  popLine: () => void
  replaceLast: (line: TerminalLine) => void
  appendOutput: (id: number, text: string) => void
  setLines: (lines: TerminalLine[]) => void
  pushHistory: (cmd: string) => void
  reset: () => void
}

export const useTerminalStore = create<TerminalStore>()(
  persist(
    (set) => ({
      lines: [],
      idx: 0,
      history: [],

      addBootLine: (line) =>
        set((s) => ({ lines: [...s.lines, line], idx: s.idx + 1 })),

      advanceBoot: (idx) => set({ idx }),

      addLine: (line) => set((s) => ({ lines: [...s.lines, line] })),

      addLines: (lines) =>
        set((s) => ({ lines: [...s.lines, ...lines] })),

      popLine: () =>
        set((s) => ({ lines: s.lines.slice(0, -1) })),

      replaceLast: (line) =>
        set((s) => {
          const lines = [...s.lines]
          lines[lines.length - 1] = line
          return { lines }
        }),

      appendOutput: (id, text) =>
        set((s) => {
          const lines = [...s.lines]
          if (lines[id]) {
            lines[id] = { ...lines[id], out: (lines[id].out || "") + text }
          }
          return { lines }
        }),

      setLines: (lines) => set({ lines }),

      pushHistory: (cmd) =>
        set((s) => ({
          history: [...s.history.filter((h) => h !== cmd), cmd].slice(-50),
        })),

      reset: () => set({ lines: [], idx: 0, history: [] }),
    }),
    { name: "portfolio-terminal-state" },
  ),
)
