"use client"

import { useEffect, useRef } from "react"

interface ContextMenuProps {
  x: number
  y: number
  items: { label: string; onClick: () => void }[]
  onClose: () => void
}

export function ContextMenu({ x, y, items, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    document.addEventListener("mousedown", handleClick)
    document.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("mousedown", handleClick)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [onClose])

  return (
    <div
      ref={menuRef}
      className="fixed z-[10000] min-w-[180px] rounded-lg overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.6)] border border-white/10 backdrop-blur-2xl"
      style={{
        left: x,
        top: y,
        background: "rgba(20, 25, 35, 0.92)",
      }}
    >
      {items.map((item, i) => (
        <button
          key={i}
          onClick={() => {
            item.onClick()
            onClose()
          }}
          className="w-full text-left px-4 py-2 text-sm text-[#c8d0d8] hover:bg-white/8 hover:text-white transition-colors cursor-pointer"
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}
