"use client"

import { useState, useRef, useEffect, useMemo, useCallback } from "react"
import { TERMINAL_LINES } from "@/data/terminalLines"
import { buildCommands } from "@/data/commands"
import { useTerminalStore } from "@/stores/terminalStore"
import { useAppStore } from "@/stores/appStore"
import { useWallpaper } from "@/hooks/useWallpaper"
import { WINDOW_CONFIGS } from "@/data/windowConfigs"

export function TerminalContent({ onClose }: { onClose?: () => void }) {
  const lines = useTerminalStore((s) => s.lines)
  const idx = useTerminalStore((s) => s.idx)
  const history = useTerminalStore((s) => s.history)
  const addBootLine = useTerminalStore((s) => s.addBootLine)
  const addLine = useTerminalStore((s) => s.addLine)
  const addLines = useTerminalStore((s) => s.addLines)
  const setLines = useTerminalStore((s) => s.setLines)
  const pushHistory = useTerminalStore((s) => s.pushHistory)

  const [input, setInput] = useState("")
  const [histIdx, setHistIdx] = useState(-1)
  const endRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { wallpaper, setWallpaper } = useWallpaper()
  const vfs = useAppStore((s) => s.vfs)
  const updateVfsNode = useAppStore((s) => s.updateVfsNode)
  const deleteVfsNode = useAppStore((s) => s.deleteVfsNode)
  const setThemeMode = useAppStore((s) => s.setThemeMode)
  const setAccentColor = useAppStore((s) => s.setAccentColor)
  
  // We need a way to trigger openWindow from terminal.
  // We can't easily pass the openWindow from PortfolioOS directly unless we use a store action for it.
  // Actually, opening a window is just adding it to the store.
  const addWindow = useAppStore((s) => s.addWindow)
  const windows = useAppStore((s) => s.windows)
  const focusWindow = useAppStore((s) => s.focusWindow)
  const setWindowMinimized = useAppStore((s) => s.setWindowMinimized)
  const getNextZ = useAppStore((s) => s.getNextZ)

  const openWindow = useCallback((id: string) => {
    const cfg = WINDOW_CONFIGS[id]
    if (!cfg) return
    if (windows[id]) {
      focusWindow(id)
      setWindowMinimized(id, false)
    } else {
      addWindow(id, {
        pos: { x: 100, y: 100 },
        minimized: false,
        z: getNextZ()
      })
    }
  }, [windows, addWindow, focusWindow, setWindowMinimized, getNextZ])

  const commands = useMemo(() => buildCommands(vfs, updateVfsNode, deleteVfsNode, {
    setThemeMode,
    setAccentColor,
    setWallpaper,
    openWindow
  }), [vfs, updateVfsNode, deleteVfsNode, setThemeMode, setAccentColor, setWallpaper, openWindow])

  useEffect(() => {
    if (idx < TERMINAL_LINES.length - 1) {
      const t = setTimeout(() => {
        addBootLine(TERMINAL_LINES[idx])
      }, 420)
      return () => clearTimeout(t)
    }
  }, [idx, addBootLine])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [lines])

  const getCompletions = (partial: string): string[] => {
    const all = [...commands.keys()]
    if (!partial) return all.slice(0, 20)
    return all.filter((c) => c.startsWith(partial)).slice(0, 20)
  }

  const handleCmd = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab") {
      e.preventDefault()
      const partial = input.trim()
      const completions = getCompletions(partial)
      if (completions.length === 1 && completions[0] !== partial) {
        setInput(completions[0])
      } else if (completions.length > 1) {
        const unique = [...new Set(completions.map((c) => c.split(" ")[0]))]
        addLine({ out: unique.join("  ") })
      }
      return
    }

    if (e.key === "ArrowUp") {
      e.preventDefault()
      if (history.length === 0) return
      const newIdx = Math.max(0, histIdx === -1 ? history.length - 1 : histIdx - 1)
      setHistIdx(newIdx)
      setInput(history[newIdx])
      return
    }

    if (e.key === "ArrowDown") {
      e.preventDefault()
      if (histIdx === -1) return
      if (histIdx >= history.length - 1) {
        setHistIdx(-1)
        setInput("")
        return
      }
      const newIdx = histIdx + 1
      setHistIdx(newIdx)
      setInput(history[newIdx])
      return
    }

    if (e.key !== "Enter") return
    const cmd = input.trim()

    if (!cmd) return

    addLine({ ps: true, cmd })
    pushHistory(cmd)
    setHistIdx(-1)
    setInput("")

    if (cmd === "clear" || cmd === "cls") {
      setLines([])
      return
    }

    if (cmd === "exit") {
      onClose?.()
      return
    }

    const parts = cmd.split(/\s+/)
    const name = parts[0]
    const args = parts.slice(1)

    const command = commands.get(name)
    if (!command) {
      addLine({ out: `bash: ${name}: command not found` })
      return
    }

    if (args.includes("--help")) {
      addLines(await command.handler(["--help"]))
      return
    }

    addLines(await command.handler(args))
  }

  return (
    <div className="h-full flex flex-col bg-[#0a0f14] font-mono" onClick={() => inputRef.current?.focus()}>
      <div className="flex-1 overflow-auto p-4 text-sm space-y-0.5">
        {lines.map((line, i) =>
          line.ps ? (
            <div key={i} className="flex gap-2 flex-wrap">
              <span className="text-[#34d399] shrink-0">kaptain@portfolio</span>
              <span className="text-[#4a6b7a] shrink-0">:~$</span>
              <span className="text-[#e2e8f0]">{line.cmd}</span>
            </div>
          ) : line.out !== undefined ? (
            <div
              key={i}
              className="whitespace-pre-wrap break-all"
              style={line.out === "" && !line.flag ? { height: "0.25rem" } : line.color ? { color: line.color } : { color: "#60a5fa" }}
            >
              {line.out || ""}
              {line.flag && (
                <img
                  src={`https://flagcdn.com/w20/${line.flag}.png`}
                  alt={line.flag.toUpperCase()}
                  className="inline-block w-4 h-3 align-text-bottom ml-0.5"
                />
              )}
              {!line.out && !line.flag && "\u00A0"}
            </div>
          ) : null,
        )}
        <div ref={endRef} />
      </div>
      <div className="flex gap-2 items-center shrink-0 px-4 py-1.5 bg-[#0a0f14] border-t border-white/5">
        <span className="text-[#34d399] shrink-0">kaptain@portfolio</span>
        <span className="text-[#4a6b7a] shrink-0">:~$</span>
        <input
          ref={inputRef}
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleCmd}
          className="bg-transparent outline-none flex-1 text-sm text-[#e2e8f0] caret-[#34d399] min-w-0"
          spellCheck={false}
          autoComplete="off"
        />
      </div>
    </div>
  )
}
