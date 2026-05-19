"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { TERMINAL_LINES } from "@/data/terminalLines"
import { buildCommands } from "@/data/commands"
import type { TerminalLine } from "@/types/portfolio"

export function TerminalContent() {
  const [lines, setLines] = useState<TerminalLine[]>([TERMINAL_LINES[0]])
  const [idx, setIdx] = useState(1)
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<string[]>([])
  const [histIdx, setHistIdx] = useState(-1)
  const endRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const commands = useMemo(() => buildCommands(), [])

  useEffect(() => {
    if (idx < TERMINAL_LINES.length - 1) {
      const t = setTimeout(() => {
        setLines((l) => [...l, TERMINAL_LINES[idx]])
        setIdx((i) => i + 1)
      }, 420)
      return () => clearTimeout(t)
    }
  }, [idx])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [lines])

  const getCompletions = (partial: string): string[] => {
    const all = [...commands.keys()]
    if (!partial) return all.slice(0, 20)
    return all.filter((c) => c.startsWith(partial)).slice(0, 20)
  }

  const handleCmd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab") {
      e.preventDefault()
      const partial = input.trim()
      const completions = getCompletions(partial)
      if (completions.length === 1 && completions[0] !== partial) {
        setInput(completions[0])
      } else if (completions.length > 1) {
        const unique = [...new Set(completions.map((c) => c.split(" ")[0]))]
        setLines((l) => [
          ...l,
          { out: unique.join("  ") },
        ])
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

    setLines((l) => [...l, { ps: true, cmd }])
    setHistory((h) => [...h, cmd])
    setHistIdx(-1)
    setInput("")

    if (cmd === "clear") {
      setLines([])
      return
    }

    const parts = cmd.split(/\s+/)
    const name = parts[0]
    const args = parts.slice(1)

    const command = commands.get(name)
    if (!command) {
      setLines((l) => [...l, { out: `bash: ${name}: command not found` }])
      return
    }

    if (args.includes("--help")) {
      setLines((l) => [...l, ...command.handler(["--help"])])
      return
    }

    const output = command.handler(args)
    setLines((l) => [...l, ...output])
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
              style={line.out === "" ? { height: "0.25rem" } : line.color ? { color: line.color } : { color: "#60a5fa" }}
            >
              {line.out || "\u00A0"}
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
