"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { FiMonitor } from "react-icons/fi"
import { WINDOW_CONFIGS } from "@/data/windowConfigs"
import Image from "next/image"

interface MenuItemDef {
  label: string
  action?: string
  shortcut?: string
  disabled?: boolean
}

type MenuGroup = {
  label: string
  items: (MenuItemDef | "separator")[]
}

interface MenuBarProps {
  dateStr: string
  timeStr: string
  onAction: (action: string) => void
  focusedWindow: string | null
  openWindows: string[]
  onFocusWindow: (id: string) => void
}

const STATIC_MENUS: MenuGroup[] = [
  {
    label: "File",
    items: [
      { label: "New Window", shortcut: "⌘N", action: "new-window" },
      { label: "Close Window", shortcut: "⌘W", action: "close-window" },
      "separator",
      { label: "System Settings...", action: "open-settings" },
      { label: "Change Wallpaper...", action: "change-wallpaper" },
    ],
  },
  {
    label: "View",
    items: [
      { label: "Toggle Dock", shortcut: "⌘⌥D", action: "toggle-dock" },
      "separator",
      { label: "Enter Full Screen", shortcut: "⌃⌘F", action: "fullscreen" },
    ],
  },
  {
    label: "Window",
    items: [],
  },
  {
    label: "Help",
    items: [
      { label: "About PortfolioOS", action: "about-os" },
      "separator",
      { label: "View on GitHub", action: "github" },
    ],
  },
]

export function MenuBar({
  dateStr,
  timeStr,
  onAction,
  focusedWindow,
  openWindows,
  onFocusWindow,
}: MenuBarProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const barRef = useRef<HTMLDivElement>(null)

  const closeMenus = useCallback(() => {
    setActiveMenu(null)
  }, [])

  useEffect(() => {
    if (!activeMenu) return
    const handleClick = (e: MouseEvent) => {
      if (barRef.current && !barRef.current.contains(e.target as Node)) {
        closeMenus()
      }
    }
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenus()
    }
    document.addEventListener("mousedown", handleClick)
    document.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("mousedown", handleClick)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [activeMenu, closeMenus])

  const handleMenuClick = (label: string) => {
    setActiveMenu((prev) => (prev === label ? null : label))
  }

  const handleMenuHover = (label: string) => {
    if (activeMenu && activeMenu !== label) {
      setActiveMenu(label)
    }
  }

  const handleItemClick = (item: MenuItemDef) => {
    if (item.disabled) return
    if (item.action?.startsWith("focus-")) {
      onFocusWindow(item.action.slice(6))
    } else if (item.action) {
      onAction(item.action)
    }
    closeMenus()
  }

  const builtMenus = STATIC_MENUS.map((menu) => {
    if (menu.label !== "Window") return menu
    const dynamicItems: (MenuItemDef | "separator")[] = []

    if (openWindows.length === 0) {
      dynamicItems.push({ label: "No Open Windows", disabled: true })
    } else {
      openWindows.forEach((id) => {
        const cfg = WINDOW_CONFIGS[id]
        const isFocused = id === focusedWindow
        dynamicItems.push({
          label: `${isFocused ? "✓ " : ""}${cfg?.title || id}`,
          action: `focus-${id}`,
        })
      })
    }

    dynamicItems.push("separator")
    dynamicItems.push({
      label: "Minimize",
      shortcut: "⌘M",
      action: "minimize",
      disabled: !focusedWindow,
    })
    dynamicItems.push({
      label: "Zoom",
      action: "zoom",
      disabled: !focusedWindow,
    })

    return { ...menu, items: dynamicItems }
  })

  return (
    <div
      ref={barRef}
      className="absolute top-0 left-0 right-0 h-6.5 bg-[rgba(5,10,18,0.7)] backdrop-blur-xl border-b border-white/6 flex items-center justify-between px-4 z-9999"
    >
      <div className="flex gap-0 items-stretch h-full">
        <span className="text-sm flex items-center mr-1"><FiMonitor size={15} /></span>
        {builtMenus.map((menu) => (
          <div
            key={menu.label}
            className="relative h-full"
            onMouseEnter={() => handleMenuHover(menu.label)}
          >
            <button
              onClick={() => handleMenuClick(menu.label)}
              className={`h-full px-2.5 text-xs rounded-sm transition-colors cursor-pointer ${
                activeMenu === menu.label
                  ? "text-white bg-white/10"
                  : "text-white/70 hover:text-white hover:bg-white/8"
              }`}
            >
              {menu.label}
            </button>

            {activeMenu === menu.label && (
              <div
                className="absolute top-full left-0 min-w-[200px] rounded-lg overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.6)] border border-white/10 backdrop-blur-2xl py-1"
                style={{ background: "rgba(20, 25, 35, 0.95)" }}
              >
                {menu.items.map((item, i) =>
                  item === "separator" ? (
                    <div key={i} className="h-px bg-white/8 mx-3 my-1" />
                  ) : (
                    <button
                      key={i}
                      onClick={() => handleItemClick(item)}
                      disabled={item.disabled}
                      className={`w-full flex items-center justify-between px-3 py-1.5 text-xs transition-colors ${
                        item.disabled
                          ? "text-[#4a6b7a] cursor-default"
                          : "text-[#c8d0d8] hover:bg-white/8 hover:text-white cursor-pointer"
                      }`}
                    >
                      <span>{item.label}</span>
                      {item.shortcut && (
                        <span className="text-[10px] text-[#4a6b7a] ml-6">
                          {item.shortcut}
                        </span>
                      )}
                    </button>
                  ),
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-3 items-center">
        <span className="hidden sm:inline text-[11px] text-white/50">
          <img src="https://flagcdn.com/w20/cm.png" alt="CM" className="inline-block w-4 h-3 align-text-bottom mr-1" />
          Buea
        </span>
        <span className="hidden sm:inline text-[11px] text-white/70">{dateStr}</span>

        <span className="text-xs font-medium text-white/90">{timeStr}</span>
      </div>
    </div>
  )
}
