"use client"

import { useState, useRef, useEffect } from "react"
import { TERMINAL_LINES } from "@/data/terminalLines"

export function TerminalContent() {
  const [lines, setLines] = useState([TERMINAL_LINES[0]])
  const [idx, setIdx] = useState(1)
  const [input, setInput] = useState("")
  const endRef = useRef<HTMLDivElement>(null)

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

  const handleCmd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return
    const cmd = input.trim()
    setLines((l) => [
      ...l,
      { ps: true, cmd },
      {
        out:
          cmd === "clear"
            ? ""
            : cmd
              ? `bash: ${cmd}: command not found (try: whoami, ls, cat)`
              : "",
      },
    ])
    setInput("")
  }

  return (
    <div className="h-full flex flex-col bg-[#0a0f14] font-mono">
      <div className="flex-1 overflow-auto p-4 text-sm space-y-0.5">
        {lines.map((l, i) =>
          l.ps ? (
            <div key={i} className="flex gap-2">
              <span className="text-[#34d399]">kaptain@portfolio</span>
              <span className="text-[#4a6b7a]">:~$</span>
              <span className="text-[#e2e8f0]">{l.cmd}</span>
            </div>
          ) : l.out ? (
            <div key={i} className="pl-4 text-[#60a5fa]">
              {l.out}
            </div>
          ) : null,
        )}
        <div className="flex gap-2 items-center">
          <span className="text-[#34d399]">kaptain@portfolio</span>
          <span className="text-[#4a6b7a]">:~$</span>
          <input
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleCmd}
            className="bg-transparent outline-none flex-1 text-sm text-[#e2e8f0] caret-[#34d399]"
          />
        </div>
        <div ref={endRef} />
      </div>
    </div>
  )
}
