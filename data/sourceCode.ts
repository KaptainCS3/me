export const SOURCE_CODE: Record<string, string> = {
  "PortfolioOS.tsx": `"use client"

import { useState, useRef, useCallback, useEffect } from "react"
// ... (rest of imports)

export default function PortfolioOS() {
  const time = useTime()
  const { wallpaper, setWallpaper, resetWallpaper } = useWallpaper()
  // ... (rest of logic)

  return (
    <div className="w-full h-dvh relative overflow-hidden select-none" ...>
      <MenuBar ... />
      <BootOverlay />
      <div ref={desktopRef} ...>
        <DesktopIcons ... />
        {Object.entries(windows).map(([id, state]) => (
          <Window key={id} id={id} ... />
        ))}
      </div>
      <Dock ... />
      <Spotlight ... />
    </div>
  )
}`,
  "Window.tsx": `"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { WindowContent } from "./WindowContent"

export function Window({ id, config, pos, zIndex, ...props }) {
  const [position, setPosition] = useState(pos)
  const [isMaximized, setIsMaximized] = useState(false)
  
  // Draggable logic
  const onDragStart = (clientX, clientY) => { ... }

  return (
    <div style={{ position: "absolute", zIndex, ... }} className="window-frame">
      <div className="title-bar" onMouseDown={onMouseDown}>
        <div className="traffic-lights">
          <TrafficBtn color="#ff5f57" onClick={onClose} />
          <TrafficBtn color="#febc2e" onClick={onMinimize} />
          <TrafficBtn color="#28c840" onClick={onMaximize} />
        </div>
        <span>{config.icon} {config.title}</span>
      </div>
      <div className="content">
        <WindowContent id={id} onClose={onClose} />
      </div>
    </div>
  )
}`,
  "appStore.ts": `import { create } from "zustand"
import { persist } from "zustand/middleware"

export const useAppStore = create()(
  persist(
    (set, get) => ({
      windows: {},
      vfs: {},
      accentColor: "#34d399",
      // ... actions
    }),
    { name: "portfolio-app-state" }
  )
)`,
}
