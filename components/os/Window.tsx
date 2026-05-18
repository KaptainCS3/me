"use client"

import { useState, useRef, useCallback } from "react"
import type { WindowConfig } from "@/types/portfolio"
import { WindowContent } from "./WindowContent"

interface WindowProps {
  id: string
  config: WindowConfig
  pos: { x: number; y: number }
  zIndex: number
  isMinimized: boolean
  onClose: () => void
  onMinimize: () => void
  onFocus: () => void
  desktopRef: React.RefObject<HTMLDivElement | null>
}

export function Window({
  id,
  config,
  pos,
  zIndex,
  isMinimized,
  onClose,
  onMinimize,
  onFocus,
  desktopRef,
}: WindowProps) {
  const [position, setPosition] = useState(pos)
  const [size] = useState({ w: config.w, h: config.h })
  const [isMaximized, setIsMaximized] = useState(false)

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

  if (isMinimized) return null

  return (
    <div
      style={{
        position: "absolute",
        top: isMaximized ? 0 : position.y,
        left: isMaximized ? 0 : position.x,
        width: isMaximized ? "100%" : size.w,
        height: isMaximized ? "calc(100% - 72px)" : size.h,
        zIndex,
        borderRadius: isMaximized ? 0 : 12,
        overflow: "hidden",
      }}
      className="border border-[#1e3a4a]/50 shadow-[0_32px_80px_rgba(0,0,0,0.7),0_0_0_0.5px_#0a2030] flex flex-col"
      onMouseDown={onFocus}
    >
      <div
        onMouseDown={onMouseDown}
        className="h-9 flex items-center px-3 cursor-default select-none shrink-0 bg-[#0d1f2d] border-b border-[#1e3a4a]/50"
      >
        <div className="flex gap-[7px] mr-3">
          <button
            onClick={onClose}
            className="w-3 h-3 rounded-full bg-[#ff5f57] border-none cursor-pointer transition-[filter] duration-150 hover:brightness-125"
          />
          <button
            onClick={onMinimize}
            className="w-3 h-3 rounded-full bg-[#febc2e] border-none cursor-pointer"
          />
          <button
            onClick={() => setIsMaximized((m) => !m)}
            className="w-3 h-3 rounded-full bg-[#28c840] border-none cursor-pointer"
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
