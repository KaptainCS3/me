export const SOURCE_CODE: Record<string, string> = {
  "PortfolioOS.tsx": `"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { useTime } from "@/hooks/useTime"
import { useWallpaper } from "@/hooks/useWallpaper"
import { WINDOW_CONFIGS } from "@/data/windowConfigs"
import { DOCK_APPS } from "@/data/dockApps"
import { useAppStore } from "@/stores/appStore"
import { MenuBar } from "./MenuBar"
import { DesktopIcons } from "./DesktopIcons"
import { WelcomeOverlay, BootOverlay } from "./BootOverlay"
import { Window } from "./Window"

// ... (rest of logic)

export default function PortfolioOS() {
  const time = useTime()
  const { wallpaper, setWallpaper, resetWallpaper } = useWallpaper()
  const desktopRef = useRef<HTMLDivElement>(null)
  
  const windows = useAppStore((s) => s.windows)
  const focusedWindow = useAppStore((s) => s.focusedWindow)
  
  // Implementation of the Global Command Palette (Spotlight)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey
      if (mod && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setShowSpotlight(true)
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [])

  return (
    <div className="w-full h-dvh relative overflow-hidden select-none" ...>
      <MenuBar ... />
      <BootOverlay />
      <div ref={desktopRef} className="desktop-area">
        <DesktopIcons ... />
        {Object.entries(windows).map(([id, state]) => (
          <Window key={id} id={id} ... />
        ))}
      </div>
      <Dock ... />
      <Spotlight isOpen={showSpotlight} ... />
    </div>
  )
}`,
  "Window.tsx": `"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import type { WindowConfig } from "@/types/portfolio"
import { WindowContent } from "./WindowContent"
import { useAppStore } from "@/stores/appStore"

export function Window({ id, config, pos, zIndex, onClose, onMinimize, onFocus, desktopRef, ...props }) {
  const [position, setPosition] = useState(pos)
  const [isMaximized, setIsMaximized] = useState(false)
  
  // Window Draggable Implementation
  const onDragStart = useCallback((clientX, clientY) => {
    if (isMaximized) return
    onFocus()
    const startX = clientX - position.x
    const startY = clientY - position.y

    const onMove = (cx, cy) => {
      setPosition({ x: cx - startX, y: cy - startY })
    }
    // ... event listeners for mouse/touch
  }, [position, isMaximized, onFocus])

  return (
    <div style={{ position: "absolute", zIndex, left: position.x, top: position.y }} className="window-frame">
      <div className="title-bar" onMouseDown={onMouseDown}>
        <div className="traffic-lights">
          <TrafficBtn color="#ff5f57" icon="✕" onClick={onClose} />
          <TrafficBtn color="#febc2e" icon="−" onClick={onMinimize} />
          <TrafficBtn color="#28c840" icon="⤢" onClick={() => setIsMaximized(!isMaximized)} />
        </div>
        <span className="title-text">{config.icon} {config.title}</span>
        <button className="inspector-btn" onClick={openSource}>{"</>"}</button>
      </div>
      <div className="window-content bg-[#0a1520]">
        <WindowContent id={id} onClose={onClose} />
      </div>
    </div>
  )
}`,
  "appStore.ts": `import { create } from "zustand"
import { persist } from "zustand/middleware"

// The Core Engine of the Portfolio OS
// Handles Window Management, Virtual File System, and Theme Persistence
export const useAppStore = create()(
  persist(
    (set, get) => ({
      windows: {},
      vfs: INITIAL_VFS,
      accentColor: "#34d399",
      themeMode: "dark",
      
      addWindow: (id, state) => set((s) => ({ 
        windows: { ...s.windows, [id]: state } 
      })),
      
      updateVfsNode: (path, node) => set((s) => ({ 
        vfs: { ...s.vfs, [path]: node } 
      })),
      
      // ... rest of the OS actions
    }),
    { name: "portfolio-app-state" }
  )
)`,
}
