"use client"

import { useState, useCallback } from "react"
import { useAppStore } from "@/stores/appStore"

interface TrashBinProps {
  onOpenTrash: () => void
}

export function TrashBin({ onOpenTrash }: TrashBinProps) {
  const trashItems = useAppStore((s) => s.trashItems)
  const trashDesktopItem = useAppStore((s) => s.trashDesktopItem)
  const [dragOver, setDragOver] = useState(false)

  const hasItems = trashItems.length > 0

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
      const draggedId = e.dataTransfer.getData("text/plain")
      if (draggedId) {
        trashDesktopItem(draggedId)
      }
    },
    [trashDesktopItem],
  )

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onDoubleClick={onOpenTrash}
      className="absolute flex flex-col items-center gap-0.5 cursor-pointer group"
      style={{ right: 24, bottom: 140, width: 56 }}
    >
      <div
        className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl transition-all duration-200 ${
          dragOver
            ? "bg-red-500/20 border-red-400/40 scale-110"
            : "bg-white/7 border-white/10 group-hover:bg-white/12 group-hover:border-white/20"
        } border`}
      >
        {hasItems ? (
          <span className="drop-shadow-[0_0_6px_rgba(239,68,68,0.5)]">🗑️</span>
        ) : (
          <span className="opacity-60">🗑️</span>
        )}
      </div>
      <span className="text-[10px] text-white/70 text-center leading-tight [text-shadow:0_1px_3px_rgba(0,0,0,0.8)]">
        Trash
      </span>
      {hasItems && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center">
          {trashItems.length > 9 ? "9+" : trashItems.length}
        </span>
      )}
    </div>
  )
}
