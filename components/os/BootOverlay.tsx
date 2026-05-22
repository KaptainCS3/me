"use client"

import { useState, useEffect } from "react"
import { useAppStore } from "@/stores/appStore"

const BOOT_LOGS = [
  "BIOS Version 2.0.26 - Date: 05/19/2026",
  "CPU: Portfolio v1.0 @ 4.2GHz",
  "Memory Test: 64MB OK",
  "",
  "Detecting Primary Master... PORTFOLIO-VFS",
  "Detecting Secondary Master... RESUME-PDF",
  "Detecting USB Devices... MOUSE, KEYBOARD",
  "",
  "Mounting VFS...",
  "Loading kernel modules...",
  "Starting system services...",
  "Initializing Desktop Environment...",
  "",
  "Boot sequence complete.",
]

export function WelcomeOverlay({ visible: _visible }: { visible: boolean }) {
  return null
}

export function BootOverlay() {
  const [logs, setLogs] = useState<string[]>([])
  const [done, setDone] = useState(false)
  const setIsBooted = useAppStore((s) => s.setIsBooted)
  const isBooted = useAppStore((s) => s.isBooted)

  useEffect(() => {
    if (isBooted) return

    let current = 0
    const interval = setInterval(() => {
      if (current < BOOT_LOGS.length) {
        setLogs((prev) => [...prev, BOOT_LOGS[current]])
        current++
      } else {
        clearInterval(interval)
        setTimeout(() => setDone(true), 300)
        setTimeout(() => setIsBooted(true), 700)
      }
    }, 60)

    return () => clearInterval(interval)
  }, [isBooted, setIsBooted])

  if (isBooted) return null

  return (
    <div 
      className={`fixed inset-0 z-99999 bg-black font-mono text-sm p-8 flex flex-col gap-0.5 transition-opacity duration-700 ${done ? "opacity-0" : "opacity-100"}`}
      style={{ color: "#34d399" }}
    >
      {logs.map((log, i) => (
        log ? (
          <div key={i}>{log}</div>
        ) : (
          <div key={i} className="h-3" />
        )
      ))}
      {!done && <div className="animate-pulse inline-block w-2 h-4 bg-[#34d399] mt-0.5" />}
      
      {done && (
        <div className="mt-6 text-white animate-pulse text-sm">
          Starting Portfolio OS...
        </div>
      )}
    </div>
  )
}
