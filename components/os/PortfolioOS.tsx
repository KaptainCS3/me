"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { useTime } from "@/hooks/useTime"
import { useWallpaper } from "@/hooks/useWallpaper"
import { WINDOW_CONFIGS } from "@/data/windowConfigs"
import { DOCK_APPS } from "@/data/dockApps"
import { useAppStore } from "@/stores/appStore"
import { useTerminalStore } from "@/stores/terminalStore"
import { MenuBar } from "./MenuBar"
import { DesktopIcons } from "./DesktopIcons"
import { WelcomeOverlay, BootOverlay } from "./BootOverlay"
import { Window } from "./Window"
import { DockItem } from "./DockItem"
import { Starfield } from "./Starfield"
import { ContextMenu } from "./ContextMenu"
import { WallpaperPicker } from "./WallpaperPicker"
import { FileInfoModal } from "./FileInfoModal"
import { Spotlight } from "./Spotlight"
import { FiGithub, FiImage } from "react-icons/fi"
import type { DesktopItem } from "@/types/portfolio"
import { INITIAL_VFS } from "@/data/initialVfs"

const DOCK_BOTTOM_GAP = 10
const GRID_SIZE = 84

function snapToGrid(val: number): number {
  return Math.round(val / GRID_SIZE) * GRID_SIZE
}

export default function PortfolioOS() {
  const time = useTime()
  const { wallpaper, setWallpaper, resetWallpaper } = useWallpaper()
  const desktopRef = useRef<HTMLDivElement>(null)
  const dockTimeoutRef = useRef<number | null>(null)
  const dockHoveredRef = useRef(false)
  const actionRef = useRef<((action: string) => void) | null>(null)

  const windows = useAppStore((s) => s.windows)
  const focusedWindow = useAppStore((s) => s.focusedWindow)
  const desktopItems = useAppStore((s) => s.desktopItems)
  const addWindow = useAppStore((s) => s.addWindow)
  const removeWindow = useAppStore((s) => s.removeWindow)
  const setWindowMinimized = useAppStore((s) => s.setWindowMinimized)
  const focusWindow = useAppStore((s) => s.focusWindow)
  const getNextZ = useAppStore((s) => s.getNextZ)
  const mergeDesktopItems = useAppStore((s) => s.mergeDesktopItems)
  const moveDesktopItem = useAppStore((s) => s.moveDesktopItem)
  const updateDesktopItem = useAppStore((s) => s.updateDesktopItem)

  const vfs = useAppStore((s) => s.vfs)
  const setVfs = useAppStore((s) => s.setVfs)
  const themeMode = useAppStore((s) => s.themeMode)
  const accentColor = useAppStore((s) => s.accentColor)
  const isBooted = useAppStore((s) => s.isBooted)

  useEffect(() => {
    if (Object.keys(vfs).length === 0) {
      setVfs(INITIAL_VFS)
    }
  }, [vfs, setVfs])

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", themeMode)
  }, [themeMode])

  useEffect(() => {
    document.documentElement.style.setProperty("--accent", accentColor)
    // Create a soft version of the accent color
    if (accentColor.startsWith("#")) {
      const r = parseInt(accentColor.slice(1, 3), 16)
      const g = parseInt(accentColor.slice(3, 5), 16)
      const b = parseInt(accentColor.slice(5, 7), 16)
      document.documentElement.style.setProperty("--accent-soft", `rgba(${r}, ${g}, ${b}, 0.1)`)
    } else {
      const soft = accentColor.replace("rgb", "rgba").replace(")", ", 0.1)")
      document.documentElement.style.setProperty("--accent-soft", soft)
    }
  }, [accentColor])

  const [zoomSignal, setZoomSignal] = useState(0)
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null)
  const [showWallpaperPicker, setShowWallpaperPicker] = useState(false)
  const [showSpotlight, setShowSpotlight] = useState(false)
  const [dockVisible, setDockVisible] = useState(false)
  const [fileInfoItem, setFileInfoItem] = useState<DesktopItem | null>(null)
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.matchMedia("(max-width: 640px)").matches : false,
  )

  useEffect(() => {
    if (isBooted) {
      useTerminalStore.getState().reset()
      const t1 = setTimeout(() => setDockVisible(true))
      const t2 = setTimeout(() => setDockVisible(false), 3000)
      return () => { clearTimeout(t1); clearTimeout(t2) }
    }
  }, [isBooted])

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)")
    const handler = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches)
      if (e.matches) setDockVisible(true)
    }
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  const openWindow = useCallback(
    (id: string) => {
      const cfg = WINDOW_CONFIGS[id]
      if (!cfg) return
      const existing = windows[id]
      if (existing) {
        focusWindow(id)
        setWindowMinimized(id, false)
      } else {
        const dw = desktopRef.current?.offsetWidth || 800
        const dh = desktopRef.current?.offsetHeight || 600
        const windowCount = Object.keys(windows).length
        const z = getNextZ()
        addWindow(id, {
          pos: {
            x: Math.max(20, Math.floor(dw / 2 - cfg.w / 2) + windowCount * 24),
            y: Math.max(20, Math.floor(dh / 3 - cfg.h / 3) + windowCount * 24),
          },
          minimized: false,
          z,
        })
      }
    },
    [windows, getNextZ, addWindow, focusWindow, setWindowMinimized],
  )

  const closeWindow = useCallback((id: string) => {
    removeWindow(id)
  }, [removeWindow])

  const minimizeWindow = useCallback((id: string) => {
    setWindowMinimized(id, true)
  }, [setWindowMinimized])

  const handleMenuAction = useCallback(
    (action: string) => {
      switch (action) {
        case "new-window":
          openWindow("about")
          break
        case "close-window":
          if (focusedWindow) closeWindow(focusedWindow)
          break
        case "change-wallpaper":
          setShowWallpaperPicker(true)
          break
        case "toggle-dock":
          setDockVisible((v) => !v)
          if (dockTimeoutRef.current) clearTimeout(dockTimeoutRef.current)
          break
        case "fullscreen":
          document.documentElement.requestFullscreen()
          break
        case "minimize":
        case "hide":
          if (focusedWindow) minimizeWindow(focusedWindow)
          break
        case "zoom":
          if (focusedWindow) setZoomSignal((s) => s + 1)
          break
        case "open-settings":
          openWindow("settings")
          break
        case "about-os":
          openWindow("about-os")
          break
        case "github":
          window.open("https://github.com/kaptaincs3", "_blank")
          break
        case "quit":
          Object.keys(windows).forEach((id) => closeWindow(id))
          break
        case "cycle-windows": {
          const ids = Object.keys(windows)
          if (ids.length === 0) break
          const idx = focusedWindow ? ids.indexOf(focusedWindow) : -1
          const next = ids[(idx + 1) % ids.length]
          focusWindow(next)
          break
        }
        case "open-about":
          openWindow("about")
          break
        case "open-projects":
          openWindow("projects")
          break
        case "open-skills":
          openWindow("skills")
          break
        case "open-contact":
          openWindow("contact")
          break
        case "open-terminal":
          openWindow("terminal")
          break
      }
    },
    [focusedWindow, openWindow, windows, closeWindow, focusWindow, minimizeWindow],
  )

  const handleDropFiles = useCallback(
    (files: FileList, dropX: number, dropY: number) => {
      const sx = snapToGrid(dropX)
      const sy = snapToGrid(dropY)
      const newItems: DesktopItem[] = Array.from(files).map((file, i) => {
        const id = `dropped-${Date.now()}-${i}`
        const icon = file.type.startsWith("image/")
          ? ""
          : file.type === "application/pdf"
            ? ""
            : ""
        const item: DesktopItem = {
          id,
          icon,
          label: file.name,
          x: sx + i * GRID_SIZE,
          y: sy + i * GRID_SIZE,
          fileMeta: {
            name: file.name,
            size: file.size,
            type: file.type,
          },
        }
        if (file.type.startsWith("image/")) {
          const reader = new FileReader()
          reader.onload = () => {
            if (reader.result) {
              updateDesktopItem(id, {
                fileMeta: { name: file.name, size: file.size, type: file.type, dataUrl: reader.result as string },
              })
            }
          }
          reader.readAsDataURL(file)
        }
        return item
      })
      mergeDesktopItems(newItems)
    },
    [mergeDesktopItems, updateDesktopItem],
  )

  const handleMoveItem = useCallback((id: string, x: number, y: number) => {
    moveDesktopItem(id, x, y)
  }, [moveDesktopItem])

  const handleDesktopIconClick = useCallback(
    (id: string) => {
      if (id === "resume") {
        openWindow("resume-viewer")
        return
      }
      if (id === "about") {
        openWindow("about")
        return
      }
      if (id.startsWith("dropped-")) {
        const item = desktopItems.find((di) => di.id === id)
        if (item) setFileInfoItem(item)
      }
    },
    [openWindow, desktopItems],
  )

  useEffect(() => {
    actionRef.current = handleMenuAction
  })

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey

      if (mod && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setShowSpotlight(true)
        return
      }

      if (!mod) return
      e.stopImmediatePropagation()
      const act = actionRef.current
      if (!act) return
      switch (e.key.toLowerCase()) {
        case "n":
          e.preventDefault()
          act("new-window")
          break
        case "w":
          e.preventDefault()
          act("close-window")
          break
        case "m":
          e.preventDefault()
          act("minimize")
          break
        case "h":
          e.preventDefault()
          act("hide")
          break
        case "q":
          e.preventDefault()
          act("quit")
          break
        case "d":
          if (e.altKey) {
            e.preventDefault()
            act("toggle-dock")
          }
          break
        case ",":
          e.preventDefault()
          act("change-wallpaper")
          break
        case "`":
          e.preventDefault()
          act("cycle-windows")
          break
        case "0":
          e.preventDefault()
          act("about-os")
          break
        case "1":
          e.preventDefault()
          act("open-about")
          break
        case "2":
          e.preventDefault()
          act("open-projects")
          break
        case "3":
          e.preventDefault()
          act("open-skills")
          break
        case "4":
          e.preventDefault()
          act("open-contact")
          break
        case "5":
          e.preventDefault()
          act("open-terminal")
          break
      }
    }
    document.addEventListener("keydown", onKey, { capture: true })
    return () => document.removeEventListener("keydown", onKey, { capture: true })
  }, [])

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY })
  }, [])

  const showDock = useCallback(() => {
    dockHoveredRef.current = true
    if (dockTimeoutRef.current) clearTimeout(dockTimeoutRef.current)
    setDockVisible(true)
  }, [setDockVisible])

  const hideDock = useCallback(() => {
    dockHoveredRef.current = false
    dockTimeoutRef.current = window.setTimeout(() => setDockVisible(false), 1500)
  }, [setDockVisible])

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

  const effectiveDockVisible = true

  const longPressTimer = useRef<number | null>(null)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    const x = touch.clientX
    const y = touch.clientY
    longPressTimer.current = window.setTimeout(() => {
      setContextMenu({ x, y })
    }, 600)
  }, [])

  const handleTouchEnd = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }, [])

  const handleTouchMove = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }, [])

  return (
    <div
      className="w-full h-screen min-h-screen relative overflow-hidden select-none"
      onContextMenu={handleContextMenu}
      style={{
        backgroundImage: wallpaper,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
      }}
    >
      <Starfield />

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

      <MenuBar
        dateStr={dateStr}
        timeStr={timeStr}
        onAction={handleMenuAction}
        focusedWindow={focusedWindow}
        openWindows={Object.keys(windows)}
        onFocusWindow={focusWindow}
      />
      <BootOverlay />
      <WelcomeOverlay visible={Object.keys(windows).length === 0} />

      <div
        ref={desktopRef}
        className={`absolute top-6.5 left-0 right-0 bottom-0 ${isMobile ? "overflow-y-auto" : ""}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
      >
        <DesktopIcons
          items={desktopItems}
          onMoveItem={handleMoveItem}
          onDropFiles={handleDropFiles}
          onItemClick={handleDesktopIconClick}
        />
        {Object.entries(windows).map(([id, state]) => (
          <Window
            key={id}
            id={id}
            config={WINDOW_CONFIGS[id]}
            pos={state.pos}
            zIndex={state.z}
            isMinimized={state.minimized}
            isFocused={id === focusedWindow}
            zoomSignal={zoomSignal}
            isMobile={isMobile}
            onClose={() => closeWindow(id)}
            onMinimize={() => minimizeWindow(id)}
            onFocus={() => focusWindow(id)}
            desktopRef={desktopRef}
          />
        ))}
      </div>

      <div
        className={`fixed bottom-0 left-0 right-0 h-0.5 pointer-events-none transition-opacity duration-500 z-9998 ${effectiveDockVisible ? "opacity-0" : "opacity-100"}`}
        style={{
          background: `linear-gradient(90deg, transparent 0%, var(--accent) 50%, transparent 100%)`,
          boxShadow: `0 0 6px 1px var(--accent)`,
        }}
      />
      <div
        onMouseEnter={showDock}
        onMouseLeave={hideDock}
        style={{
          transform: `translateX(-50%) ${effectiveDockVisible ? "translateY(0)" : "translateY(120%)"}`,
          transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
          bottom: `calc(${isMobile ? 0 : DOCK_BOTTOM_GAP}px + env(safe-area-inset-bottom, 0px))`,
        }}
        className="fixed left-1/2 bg-white/7 backdrop-blur-2xl border border-white/12 rounded-[18px] px-4 py-4 flex items-end gap-2.5 z-9999 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
      >
        {DOCK_APPS.map((app) => (
          <DockItem
            key={app.id}
            app={app}
            isOpen={!!windows[app.id]}
            onClick={() => {
              if (windows[app.id]) {
                const win = windows[app.id]
                if (win.minimized) {
                  focusWindow(app.id)
                  setWindowMinimized(app.id, false)
                } else if (app.id === focusedWindow) {
                  setWindowMinimized(app.id, true)
                } else {
                  focusWindow(app.id)
                }
              } else {
                openWindow(app.id)
              }
            }}
          />
        ))}
        <div className="w-px h-9 bg-white/15 mx-1" />
        <DockItem
          app={{ id: "github", icon: <FiGithub />, label: "GitHub" }}
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
              icon: <FiImage size={14} />,
              label: "Change Wallpaper...",
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

      {fileInfoItem && (
        <FileInfoModal
          item={fileInfoItem}
          onClose={() => setFileInfoItem(null)}
        />
      )}

      <Spotlight
        isOpen={showSpotlight}
        onClose={() => setShowSpotlight(false)}
        onOpenApp={openWindow}
      />
    </div>
  );
}
