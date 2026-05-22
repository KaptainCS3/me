"use client"

import { useState, useRef, useEffect, useMemo, useCallback } from "react"
import { TERMINAL_LINES } from "@/data/terminalLines"
import { buildCommands } from "@/data/commands"
import { useTerminalStore } from "@/stores/terminalStore"
import { useAppStore } from "@/stores/appStore"
import { useWallpaper } from "@/hooks/useWallpaper"
import { useTime } from "@/hooks/useTime"
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
  const { setWallpaper } = useWallpaper()
  const timeDate = useTime()
  const time = timeDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
  const vfs = useAppStore((s) => s.vfs)
  const updateVfsNode = useAppStore((s) => s.updateVfsNode)
  const deleteVfsNode = useAppStore((s) => s.deleteVfsNode)
  const setThemeMode = useAppStore((s) => s.setThemeMode)
  const setAccentColor = useAppStore((s) => s.setAccentColor)
  
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
    if (idx < TERMINAL_LINES.length) {
      const t = setTimeout(() => {
        addBootLine(TERMINAL_LINES[idx])
      }, 300)
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
      addLine({ out: `bash: ${name}: command not found`, color: "#ef4444" })
      return
    }

    if (args.includes("--help")) {
      addLines(await command.handler(await args.filter(a => a !== "--help")))
      return
    }

    if (name === "fortune") {
      addLine({ out: "Consulting the oracle..." })
    }

    addLines(await command.handler(args))
    }

  const Prompt = ({ cmd }: { cmd?: string }) => (
    <div className="flex items-center flex-wrap mb-1">
      <div className="flex items-center bg-[#34d399] text-[#060d14] px-2 h-5 font-bold relative mr-3 text-[10px]">
        kaptain@portfolio
        <div className="absolute right-[-10px] top-0 bottom-0 w-0 h-0 border-y-[10px] border-y-transparent border-l-[10px] border-l-[#34d399]" />
      </div>
      <div className="flex items-center bg-[#1e3a4a] text-[#34d399] px-2 h-5 font-bold relative mr-3 text-[10px]">
        ~
        <div className="absolute right-[-10px] top-0 bottom-0 w-0 h-0 border-y-[10px] border-y-transparent border-l-[10px] border-l-[#1e3a4a]" />
      </div>
      <span className="text-[#e2e8f0] ml-1">{cmd}</span>
    </div>
  )

  return (
    <div className="h-full flex flex-col bg-[#06090c] font-mono select-none" onClick={() => inputRef.current?.focus()}>
      {/* Terminal Viewport */}
      <div className="flex-1 overflow-auto p-4 text-[13px] leading-relaxed custom-scrollbar">
        {lines.map((line, i) =>
          line.ps ? (
            <Prompt key={i} cmd={line.cmd} />
          ) : line.out !== undefined ? (
            <div
              key={i}
              className="whitespace-pre-wrap break-all mb-1"
              style={line.out === "" && !line.flag ? { height: "0.5rem" } : line.color ? { color: line.color } : { color: "#a8c4d0" }}
            >
              {line.out || ""}
              {line.flag && (
                <img
                  src={`https://flagcdn.com/w20/${line.flag}.png`}
                  alt={line.flag.toUpperCase()}
                  className="inline-block w-4 h-3 align-text-bottom ml-1 opacity-80"
                />
              )}
              {!line.out && !line.flag && "\u00A0"}
            </div>
          ) : null,
        )}
        
        {/* Active Input Line */}
        <div className="flex items-center flex-wrap group mt-2">
           <Prompt />
           <div className="relative flex-1 flex items-center ml-1">
             <input
               ref={inputRef}
               autoFocus
               value={input}
               onChange={(e) => setInput(e.target.value)}
               onKeyDown={handleCmd}
               className="bg-transparent outline-none w-full text-[#e2e8f0] caret-transparent absolute inset-0 z-10"
               spellCheck={false}
               autoComplete="off"
             />
             <div className="flex items-center">
               <span className="text-[#e2e8f0]">{input}</span>
               <div className="w-2 h-4 bg-[#34d399] ml-0.5 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
             </div>
           </div>
        </div>
        <div ref={endRef} />
      </div>

      {/* Terminal Status Bar */}
      <div className="flex items-center justify-between bg-[#0d1117] border-t border-white/5 h-7 px-4 text-[10px] text-[#4a6b7a] font-bold shrink-0">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#34d399]" /> UTF-8</span>
          <span className="hidden sm:inline border-l border-white/10 pl-4 uppercase">bash-5.2</span>
          <span className="hidden md:inline border-l border-white/10 pl-4 uppercase">Douala, CM</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[#34d399] uppercase tracking-widest">{time}</span>
          <span className="opacity-50">v1.0.4-stable</span>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e3a4a;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #34d399;
        }
      `}</style>
    </div>
  )
}
