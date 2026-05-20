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

export function WelcomeOverlay({ visible }: { visible: boolean }) {
  // This is the old welcome overlay, I should replace its content or create a new BootOverlay
  // Actually, the plan says create components/os/BootOverlay.tsx
  // But there is already a WelcomeOverlay.tsx in components/os/
  return null // I'll create BootOverlay instead
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
        setTimeout(() => setDone(true), 500)
        setTimeout(() => setIsBooted(true), 1200)
      }
    }, 80)

    return () => clearInterval(interval)
  }, [isBooted, setIsBooted])

  if (isBooted) return null

  return (
    <div 
      className={`fixed inset-0 z-99999 bg-black font-mono text-sm p-8 flex flex-col gap-1 transition-opacity duration-1000 ${done ? "opacity-0" : "opacity-100"}`}
      style={{ color: "#34d399" }}
    >
      <div className="flex flex-col gap-0.5">
        {logs.map((log, i) => (
          <div key={i} className="min-h-[1.2rem]">
            {log}
          </div>
        ))}
        {!done && <div className="animate-pulse inline-block w-2 h-4 bg-[#34d399] ml-1" />}
      </div>
      
      {done && (
        <div className="mt-8 text-white animate-pulse">
          Starting Portfolio OS...
        </div>
      )}
    </div>
  )
}
