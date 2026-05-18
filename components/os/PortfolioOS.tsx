"use client"

import { useState, useRef, useCallback } from "react"
import { useTime } from "@/hooks/useTime"
import { WALLPAPER } from "@/data/wallpaper"
import { WINDOW_CONFIGS } from "@/data/windowConfigs"
import { DOCK_APPS } from "@/data/dockApps"
import { MenuBar } from "./MenuBar"
import { DesktopIcons } from "./DesktopIcons"
import { WelcomeOverlay } from "./WelcomeOverlay"
import { Window } from "./Window"
import { DockItem } from "./DockItem"
import type { WindowState } from "@/types/portfolio"

export default function PortfolioOS() {
  const time = useTime()
  const desktopRef = useRef<HTMLDivElement>(null)
  const [windows, setWindows] = useState<Record<string, WindowState>>({})
  const [zCounter, setZCounter] = useState(10)

  const openWindow = useCallback(
    (id: string) => {
      setZCounter((z) => {
        const newZ = z + 1
        setWindows((w) => {
          if (w[id]) {
            return { ...w, [id]: { ...w[id], minimized: false, z: newZ } }
          }
          const dw = desktopRef.current?.offsetWidth || 800
          const dh = desktopRef.current?.offsetHeight || 600
          const cfg = WINDOW_CONFIGS[id]
          if (!cfg) return w
          return {
            ...w,
            [id]: {
              pos: {
                x: Math.max(20, Math.floor(dw / 2 - cfg.w / 2) + Object.keys(w).length * 24),
                y: Math.max(20, Math.floor(dh / 3 - cfg.h / 3) + Object.keys(w).length * 24),
              },
              minimized: false,
              z: newZ,
            },
          }
        })
        return newZ
      })
    },
    [],
  )

  const closeWindow = (id: string) => {
    setWindows((w) => {
      const n = { ...w }
      delete n[id]
      return n
    })
  }

  const minimizeWindow = (id: string) => {
    setWindows((w) => ({ ...w, [id]: { ...w[id], minimized: true } }))
  }

  const focusWindow = (id: string) => {
    setZCounter((z) => {
      const newZ = z + 1
      setWindows((w) => ({ ...w, [id]: { ...w[id], z: newZ } }))
      return newZ
    })
  }

  const timeStr = time.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
  const dateStr = time.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })

  return (
    <div
      className="w-full h-screen min-h-[600px] relative overflow-hidden select-none"
      style={{
        background: WALLPAPER,
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
      }}
    >
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {Array.from({ length: 60 }, (_, i) => (
          <circle
            key={i}
            cx={`${(i * 37 + 11) % 100}%`}
            cy={`${(i * 53 + 7) % 100}%`}
            r={i % 5 === 0 ? 1.5 : 0.8}
            fill="white"
            opacity={0.1 + (i % 4) * 0.08}
          />
        ))}
      </svg>

      <div
        className="absolute w-[300px] h-[300px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(52,211,153,0.06) 0%, transparent 70%)",
          top: "10%",
          left: "15%",
        }}
      />
      <div
        className="absolute w-[250px] h-[250px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(96,165,250,0.05) 0%, transparent 70%)",
          top: "20%",
          right: "20%",
        }}
      />

      <MenuBar dateStr={dateStr} timeStr={timeStr} />
      <DesktopIcons />

      <WelcomeOverlay visible={Object.keys(windows).length === 0} />

      <div
        ref={desktopRef}
        className="absolute top-[26px] left-0 right-0 bottom-[72px]"
      >
        {Object.entries(windows).map(([id, state]) => (
          <Window
            key={id}
            id={id}
            config={WINDOW_CONFIGS[id]}
            pos={state.pos}
            zIndex={state.z}
            isMinimized={state.minimized}
            onClose={() => closeWindow(id)}
            onMinimize={() => minimizeWindow(id)}
            onFocus={() => focusWindow(id)}
            desktopRef={desktopRef}
          />
        ))}
      </div>

      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 bg-white/7 backdrop-blur-2xl border border-white/12 rounded-[18px] px-4 py-2 flex items-end gap-2.5 z-[9999] shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        {DOCK_APPS.map((app) => (
          <DockItem
            key={app.id}
            app={app}
            isOpen={!!windows[app.id] && !windows[app.id].minimized}
            onClick={() => openWindow(app.id)}
          />
        ))}
        <div className="w-px h-9 bg-white/15 mx-1" />
        <DockItem
          app={{ id: "github", icon: "🐙", label: "GitHub" }}
          isOpen={false}
          onClick={() => window.open("https://github.com/kaptaincs3", "_blank")}
        />
      </div>
    </div>
  )
}
