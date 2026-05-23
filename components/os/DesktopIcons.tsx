"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import { FiImage, FiFile, FiVideo, FiMusic, FiFolder } from "react-icons/fi"
import type { ReactNode, MouseEvent } from "react"
import type { DesktopItem } from "@/types/portfolio"
import { fileTypeBadge } from "@/lib/fileThumbnails"

const GRID = 84
const ICON_W = 56
const DRAG_THRESHOLD = 10

interface DesktopIconsProps {
  items: DesktopItem[]
  onMoveItem: (id: string, x: number, y: number) => void
  onDropFiles: (files: FileList, dropX: number, dropY: number) => void
  onItemClick: (id: string) => void
  onSelectItem?: (id: string, e?: MouseEvent) => void
  selectedIds?: Set<string>
  isMobile?: boolean
}

function getFileIcon(item: DesktopItem): ReactNode {
  if (item.fileMeta?.thumbnail) {
    const badge = fileTypeBadge(item.fileMeta.type)
    return (
      <div className="relative w-full h-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.fileMeta.thumbnail} alt="" className="w-full h-full object-cover rounded-lg" />
        <span className="absolute -bottom-0.5 -right-0.5 text-[7px] font-bold bg-black/70 text-white px-0.5 rounded leading-tight">
          {badge}
        </span>
      </div>
    )
  }
  if (item.fileMeta?.type.startsWith("image/")) return <FiImage />
  if (item.fileMeta?.type.startsWith("text/")) return <FiFile />
  if (item.fileMeta?.type === "application/pdf") return <FiFile />
  if (item.fileMeta?.type.startsWith("video/")) return <FiVideo />
  if (item.fileMeta?.type.startsWith("audio/")) return <FiMusic />
  return <FiFolder />
}

export function DesktopIcons({ items, onMoveItem, onDropFiles, onItemClick, onSelectItem, selectedIds, isMobile }: DesktopIconsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const [isTouch, setIsTouch] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(pointer: coarse)").matches
    }
    return false
  })
  const [dragState, setDragState] = useState<{
    id: string
    startX: number
    startY: number
    origX: number
    origY: number
    moved: boolean
    dragging: boolean
  } | null>(null)
  const [dragOffset, setDragOffset] = useState({ dx: 0, dy: 0 })

  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)")
    const handler = (e: MediaQueryListEvent) => setIsTouch(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  const handleClick = (id: string, e: MouseEvent) => {
    if (isTouch) {
      onItemClick(id)
    } else if (onSelectItem) {
      onSelectItem(id, e)
    }
  }

  const handleDoubleClick = (id: string) => {
    if (!isTouch) {
      onItemClick(id)
    }
  }

  const handleDragStart = useCallback(
    (e: React.DragEvent, id: string) => {
      const ids = new Set(selectedIds)
      ids.add(id)
      e.dataTransfer.setData("text/plain", JSON.stringify([...ids]))
      e.dataTransfer.effectAllowed = "move"
    },
    [selectedIds],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDragOver(false)
  }, [])

  const handleTouchStart = useCallback(
    (e: React.TouchEvent, item: DesktopItem) => {
      if (!isTouch && !isMobile) return
      const touch = e.touches[0]
      const idsToMove = selectedIds?.has(item.id)
        ? [...selectedIds]
        : [item.id]
      const dragItems = idsToMove
        .map((id) => items.find((it) => it.id === id))
        .filter((it): it is DesktopItem => !!it)
      if (dragItems.length === 0) return
      const primary = dragItems[0]
      setDragState({
        id: primary.id,
        startX: touch.clientX,
        startY: touch.clientY,
        origX: primary.x,
        origY: primary.y,
        moved: false,
        dragging: false,
      })
      setDragOffset({ dx: 0, dy: 0 })
    },
    [isTouch, isMobile, selectedIds, items],
  )

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!dragState) return
      e.preventDefault()
      const touch = e.touches[0]
      const dx = touch.clientX - dragState.startX
      const dy = touch.clientY - dragState.startY
      if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
        setDragState((prev) => (prev ? { ...prev, moved: true, dragging: true } : prev))
      }
      setDragOffset({ dx, dy })
    },
    [dragState],
  )

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!dragState) return
      if (dragState.moved) {
        const idsToMove = selectedIds?.has(dragState.id)
          ? [...selectedIds]
          : [dragState.id]
        idsToMove.forEach((id) => {
          const item = items.find((it) => it.id === id)
          if (item) {
            const nx = Math.max(0, item.x + dragOffset.dx)
            const ny = Math.max(0, item.y + dragOffset.dy)
            onMoveItem(id, nx, ny)
          }
        })
      } else {
        onItemClick(dragState.id)
      }
      setDragState(null)
      setDragOffset({ dx: 0, dy: 0 })
    },
    [dragState, dragOffset, selectedIds, items, onMoveItem, onItemClick],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)

      const container = containerRef.current
      if (!container) return
      const rect = container.getBoundingClientRect()
      const cw = container.offsetWidth
      const ch = container.offsetHeight
      const bottomReserved = isMobile ? 60 : 140
      const maxX = Math.floor((cw - ICON_W) / GRID) * GRID
      const maxY = Math.floor((ch - bottomReserved) / GRID) * GRID
      const rawX = e.clientX - rect.left - 28
      const rawY = e.clientY - rect.top - 28
      const dropX = Math.max(0, Math.min(rawX, maxX))
      const dropY = Math.max(0, Math.min(rawY, maxY))

      const data = e.dataTransfer.getData("text/plain")
      if (data) {
        try {
          const ids: string[] = JSON.parse(data)
          if (Array.isArray(ids) && ids.length > 0) {
            const primary = ids[0]
            const origItem = items.find((it) => it.id === primary)
            if (origItem) {
              const dx = dropX - origItem.x
              const dy = dropY - origItem.y
              ids.forEach((id) => {
                const item = items.find((it) => it.id === id)
                if (item) {
                  const nx = Math.max(0, Math.min(item.x + dx, maxX))
                  const ny = Math.max(0, Math.min(item.y + dy, maxY))
                  onMoveItem(id, nx, ny)
                }
              })
            }
          }
          return
        } catch {
          // single item drag (legacy format)
          onMoveItem(data, dropX, dropY)
          return
        }
      }

      if (e.dataTransfer.files.length > 0) {
        onDropFiles(e.dataTransfer.files, dropX, dropY)
      }
    },
    [onMoveItem, onDropFiles, items],
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
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {items.map((item) => {
        const offset = dragState?.id === item.id ? dragOffset : null
        return (
          <div
            key={item.id}
            data-desktop-icon
            draggable={!isTouch}
            onDragStart={(e) => handleDragStart(e, item.id)}
            onClick={(e) => handleClick(item.id, e)}
            onDoubleClick={() => handleDoubleClick(item.id)}
            onTouchStart={(e) => handleTouchStart(e, item)}
            className="absolute flex flex-col items-center gap-0.5 cursor-pointer group"
            style={{
              left: item.x + (offset?.dx ?? 0),
              top: item.y + (offset?.dy ?? 0),
              width: 56,
              transition: dragState?.dragging ? "none" : undefined,
              zIndex: dragState?.id === item.id ? 9999 : undefined,
              touchAction: dragState?.id === item.id ? "none" : "auto",
            }}
          >
            <div className={`w-11 h-11 rounded-lg flex items-center justify-center text-2xl transition-colors ${
              selectedIds?.has(item.id)
                ? "bg-accent/20 border-accent/50 ring-1 ring-accent/40"
                : "bg-white/7 border-white/10 group-hover:bg-white/12 group-hover:border-white/20"
            } border`}>
            {getFileIcon(item)}
          </div>
          <span className="text-[10px] text-white/70 text-center leading-tight [text-shadow:0_1px_3px_rgba(0,0,0,0.8)] wrap-break-word max-w-14">
            {item.label}
          </span>
        </div>
        )
      })}
    </div>
  )
}
