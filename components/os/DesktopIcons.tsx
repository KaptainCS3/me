"use client"

import { useRef, useState, useCallback } from "react"
import type { DesktopItem } from "@/types/portfolio"

interface DesktopIconsProps {
  items: DesktopItem[]
  onMoveItem: (id: string, x: number, y: number) => void
  onDropFiles: (files: FileList, dropX: number, dropY: number) => void
  onItemClick: (id: string) => void
}

function getFileIcon(type: string): string {
  if (type.startsWith("image/")) return "🖼️"
  if (type.startsWith("text/")) return "📝"
  if (type === "application/pdf") return "📄"
  if (type.startsWith("video/")) return "🎬"
  if (type.startsWith("audio/")) return "🎵"
  return "📁"
}

export function DesktopIcons({ items, onMoveItem, onDropFiles, onItemClick }: DesktopIconsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dragOver, setDragOver] = useState(false)

  const handleDragStart = useCallback(
    (e: React.DragEvent, id: string) => {
      e.dataTransfer.setData("text/plain", id)
      e.dataTransfer.effectAllowed = "move"
    },
    [],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)

      const container = containerRef.current
      if (!container) return
      const rect = container.getBoundingClientRect()
      const dropX = e.clientX - rect.left - 28
      const dropY = e.clientY - rect.top - 28

      const draggedId = e.dataTransfer.getData("text/plain")
      if (draggedId) {
        onMoveItem(draggedId, dropX, dropY)
        return
      }

      if (e.dataTransfer.files.length > 0) {
        onDropFiles(e.dataTransfer.files, dropX, dropY)
      }
    },
    [onMoveItem, onDropFiles],
  )

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 transition-colors duration-200 ${
        dragOver ? "bg-white/5" : ""
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {items.map((item) => (
        <div
          key={item.id}
          draggable
          onDragStart={(e) => handleDragStart(e, item.id)}
          onDoubleClick={() => onItemClick(item.id)}
          className="absolute flex flex-col items-center gap-0.5 cursor-pointer group"
          style={{ left: item.x, top: item.y, width: 56 }}
        >
          <div className="w-11 h-11 rounded-lg bg-white/7 border border-white/10 flex items-center justify-center text-2xl group-hover:bg-white/12 group-hover:border-white/20 transition-colors">
            {item.icon}
          </div>
          <span className="text-[10px] text-white/70 text-center leading-tight [text-shadow:0_1px_3px_rgba(0,0,0,0.8)] break-words max-w-[56px]">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  )
}
