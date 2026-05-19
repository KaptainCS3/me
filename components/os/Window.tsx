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
  isMobile?: boolean
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
      className="w-5 h-5 sm:w-3 sm:h-3 rounded-full border-none cursor-pointer flex items-center justify-center transition-[filter] duration-150 hover:brightness-125"
      style={{ background: color }}
    >
      {hovered && (
        <span className="text-[10px] sm:text-[7px] font-bold" style={{ color: hoverColor }}>
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
  isMobile,
  onClose,
  onMinimize,
  onFocus,
  desktopRef,
}: WindowProps) {
  const [position, setPosition] = useState(pos)
  const [isMaximized, setIsMaximized] = useState(false)
  const prevZoom = useRef(zoomSignal)

  const [size, setSize] = useState({ w: config.w, h: config.h })

  useEffect(() => {
    if (isFocused && zoomSignal !== prevZoom.current) {
      setIsMaximized((m) => !m)
      prevZoom.current = zoomSignal
    }
  }, [zoomSignal, isFocused])

  useEffect(() => {
    const updateSize = () => {
      const vw = window.innerWidth
      const vh = window.innerHeight
      const deskH = desktopRef.current?.offsetHeight ?? vh
      const maxW = Math.min(config.w, vw - 16)
      const maxH = Math.min(config.h, Math.floor(deskH * 0.9))
      setSize({ w: maxW, h: maxH })
    }
    updateSize()
    window.addEventListener("resize", updateSize)
    return () => window.removeEventListener("resize", updateSize)
  }, [config.w, config.h, desktopRef])

  const clampPos = useCallback(
    (x: number, y: number) => {
      const desktop = desktopRef.current
      if (!desktop) return { x, y }
      const rect = desktop.getBoundingClientRect()
      return {
        x: Math.max(0, Math.min(x, rect.width - size.w)),
        y: Math.max(0, Math.min(y, rect.height - 80)),
      }
    },
    [size, desktopRef],
  )

  const onDragStart = useCallback(
    (clientX: number, clientY: number) => {
      if (isMaximized) return
      onFocus()
      const startX = clientX - position.x
      const startY = clientY - position.y

      const onMove = (cx: number, cy: number) => {
        setPosition((prev) => {
          const clamped = clampPos(cx - startX, cy - startY)
          return clamped
        })
      }

      const onMouseMove = (me: MouseEvent) => {
        onMove(me.clientX, me.clientY)
      }

      const onTouchMove = (te: TouchEvent) => {
        te.preventDefault()
        const t = te.touches[0]
        onMove(t.clientX, t.clientY)
      }

      const onUp = () => {
        window.removeEventListener("mousemove", onMouseMove)
        window.removeEventListener("mouseup", onUp)
        window.removeEventListener("touchmove", onTouchMove)
        window.removeEventListener("touchend", onUp)
      }

      window.addEventListener("mousemove", onMouseMove)
      window.addEventListener("mouseup", onUp)
      window.addEventListener("touchmove", onTouchMove, { passive: false })
      window.addEventListener("touchend", onUp)
    },
    [position, isMaximized, onFocus, clampPos],
  )

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      onDragStart(e.clientX, e.clientY)
    },
    [onDragStart],
  )

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0]
      if (touch) onDragStart(touch.clientX, touch.clientY)
    },
    [onDragStart],
  )

  return (
    <div
      style={{
        position: "absolute",
        top: isMaximized ? 0 : position.y,
        left: isMaximized ? 0 : position.x,
        width: isMaximized ? "100%" : size.w,
        height: isMaximized ? (isMobile ? "calc(100% - 90px)" : "100%") : size.h,
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
        onTouchStart={onTouchStart}
        className="h-11 sm:h-9 flex items-center px-3 cursor-default select-none shrink-0 bg-[#0d1f2d] border-b border-[#1e3a4a]/50"
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
        <span className="text-xs text-[#6b8fa0] flex-1 text-center truncate mx-2">
          {config.icon} {config.title}
        </span>
      </div>
      <div className="flex-1 overflow-hidden bg-[#0a1520]">
        <WindowContent id={id} onClose={onClose} />
      </div>
    </div>
  )
}
