"use client"

import { useState, useRef, useCallback } from "react"
import { useTime } from "@/hooks/useTime"
import { useWallpaper } from "@/hooks/useWallpaper"
import { WINDOW_CONFIGS } from "@/data/windowConfigs"
import { DOCK_APPS } from "@/data/dockApps"
import { MenuBar } from "./MenuBar"
import { DesktopIcons } from "./DesktopIcons"
import { WelcomeOverlay } from "./WelcomeOverlay"
import { Window } from "./Window"
import { DockItem } from "./DockItem"
import { ContextMenu } from "./ContextMenu"
import { WallpaperPicker } from "./WallpaperPicker"
import type { WindowState } from "@/types/portfolio"

const DOCK_BOTTOM_GAP = 10

export default function PortfolioOS() {
  const time = useTime()
  const { wallpaper, setWallpaper, resetWallpaper } = useWallpaper()
  const desktopRef = useRef<HTMLDivElement>(null)
  const dockTimeoutRef = useRef<number | null>(null)
  const dockHoveredRef = useRef(false)
  const [windows, setWindows] = useState<Record<string, WindowState>>({})
  const [zCounter, setZCounter] = useState(10)
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null)
  const [showWallpaperPicker, setShowWallpaperPicker] = useState(false)
  const [dockVisible, setDockVisible] = useState(false)

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

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY })
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const bottomThreshold = 10
    const nearBottom = e.clientY >= window.innerHeight - bottomThreshold
    if (dockTimeoutRef.current) clearTimeout(dockTimeoutRef.current)
    if (nearBottom) {
      setDockVisible(true)
    } else if (!dockHoveredRef.current) {
      dockTimeoutRef.current = window.setTimeout(() => setDockVisible(false), 500)
    }
  }, [])

  const showDock = useCallback(() => {
    dockHoveredRef.current = true
    if (dockTimeoutRef.current) clearTimeout(dockTimeoutRef.current)
    setDockVisible(true)
  }, [])

  const hideDock = useCallback(() => {
    dockHoveredRef.current = false
    dockTimeoutRef.current = window.setTimeout(() => setDockVisible(false), 300)
  }, [])

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
      className="w-full h-screen min-h-150 relative overflow-hidden select-none"
      onContextMenu={handleContextMenu}
      onMouseMove={handleMouseMove}
      style={{
        backgroundImage: wallpaper,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
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
        className="absolute w-75 h-75 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(52,211,153,0.06) 0%, transparent 70%)",
          top: "10%",
          left: "15%",
        }}
      />
      <div
        className="absolute w-75 h-75 rounded-full pointer-events-none"
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
        className="absolute top-6.5 left-0 right-0 bottom-0"
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

      <div
        onMouseEnter={showDock}
        onMouseLeave={hideDock}
        style={{
          transform: dockVisible ? "translateY(0)" : "translateY(120%)",
          transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
          bottom: DOCK_BOTTOM_GAP,
        }}
        className="absolute left-1/2 -translate-x-1/2 bg-white/7 backdrop-blur-2xl border border-white/12 rounded-[18px] px-4 py-2 flex items-end gap-2.5 z-[9999] shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
      >
        {DOCK_APPS.map((app) => (
          <DockItem
            key={app.id}
            app={app}
            isOpen={!!windows[app.id]}
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

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={[
            {
              label: "🖼️ Change Wallpaper...",
              onClick: () => setShowWallpaperPicker(true),
            },
          ]}
          onClose={() => setContextMenu(null)}
        />
      )}

      {showWallpaperPicker && (
        <WallpaperPicker
          current={wallpaper}
          onSelect={setWallpaper}
          onReset={resetWallpaper}
          onClose={() => setShowWallpaperPicker(false)}
        />
      )}
    </div>
  )
}
