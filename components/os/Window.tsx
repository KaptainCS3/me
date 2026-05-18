"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import type { WindowConfig } from "@/types/portfolio"
import { WindowContent } from "./WindowContent"

interface WindowProps {
  id: string
  config: WindowConfig
  pos: { x: number; y: number }
  zIndex: number
  isMinimized: boolean
  isFocused: boolean
  zoomSignal: number
  onClose: () => void
  onMinimize: () => void
  onFocus: () => void
  desktopRef: React.RefObject<HTMLDivElement | null>
}

function TrafficBtn({
  color,
  hoverColor,
  icon,
  onClick,
}: {
  color: string
  hoverColor: string
  icon: string
  onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="w-3 h-3 rounded-full border-none cursor-pointer flex items-center justify-center transition-[filter] duration-150 hover:brightness-125"
      style={{ background: color }}
    >
      {hovered && (
        <span className="text-[7px] font-bold" style={{ color: hoverColor }}>
          {icon}
        </span>
      )}
    </button>
  )
}

export function Window({
  id,
  config,
  pos,
  zIndex,
  isMinimized,
  isFocused,
  zoomSignal,
  onClose,
  onMinimize,
  onFocus,
  desktopRef,
}: WindowProps) {
  const [position, setPosition] = useState(pos)
  const [size] = useState({ w: config.w, h: config.h })
  const [isMaximized, setIsMaximized] = useState(false)
  const prevZoom = useRef(zoomSignal)

  useEffect(() => {
    if (isFocused && zoomSignal !== prevZoom.current) {
      setIsMaximized((m) => !m)
      prevZoom.current = zoomSignal
    }
  }, [zoomSignal, isFocused])

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (isMaximized) return
      onFocus()
      const startX = e.clientX - position.x
      const startY = e.clientY - position.y

      const onMove = (me: MouseEvent) => {
        const desktop = desktopRef.current
        if (!desktop) return
        const rect = desktop.getBoundingClientRect()
        const newX = Math.max(0, Math.min(me.clientX - startX, rect.width - size.w))
        const newY = Math.max(0, Math.min(me.clientY - startY, rect.height - 80))
        setPosition({ x: newX, y: newY })
      }

      const onUp = () => {
        window.removeEventListener("mousemove", onMove)
        window.removeEventListener("mouseup", onUp)
      }

      window.addEventListener("mousemove", onMove)
      window.addEventListener("mouseup", onUp)
    },
    [position, size, isMaximized, onFocus, desktopRef],
  )

  return (
    <div
      style={{
        position: "absolute",
        top: isMaximized ? 0 : position.y,
        left: isMaximized ? 0 : position.x,
        width: isMaximized ? "100%" : size.w,
        height: isMaximized ? "100%" : size.h,
        zIndex,
        borderRadius: isMaximized ? 0 : 12,
        overflow: "hidden",
        display: isMinimized ? "none" : undefined,
      }}
      className="border border-[#1e3a4a]/50 shadow-[0_32px_80px_rgba(0,0,0,0.7),0_0_0_0.5px_#0a2030] flex flex-col"
      onMouseDown={onFocus}
    >
      <div
        onMouseDown={onMouseDown}
        className="h-9 flex items-center px-3 cursor-default select-none shrink-0 bg-[#0d1f2d] border-b border-[#1e3a4a]/50"
      >
        <div className="flex gap-[7px] mr-3">
          <TrafficBtn
            color="#ff5f57"
            hoverColor="#400"
            icon="✕"
            onClick={onClose}
          />
          <TrafficBtn
            color="#febc2e"
            hoverColor="#400"
            icon="−"
            onClick={onMinimize}
          />
          <TrafficBtn
            color="#28c840"
            hoverColor="#040"
            icon="⤢"
            onClick={() => setIsMaximized((m) => !m)}
          />
        </div>
        <span className="text-xs text-[#6b8fa0] flex-1 text-center">
          {config.icon} {config.title}
        </span>
      </div>
      <div className="flex-1 overflow-hidden bg-[#0a1520]">
        <WindowContent id={id} />
      </div>
    </div>
  )
}
