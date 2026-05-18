"use client"

import { useEffect, useRef } from "react"
import type { DesktopItem } from "@/types/portfolio"

interface FileInfoModalProps {
  item: DesktopItem
  onClose: () => void
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function FileInfoModal({ item, onClose }: FileInfoModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    const handleClickOutside = (e: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener("keydown", handleEscape)
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  const meta = item.fileMeta

  return (
    <div className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div
        ref={dialogRef}
        className="w-[340px] rounded-xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.7)] border border-white/10"
        style={{ background: "rgba(15, 20, 30, 0.95)" }}
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/8">
          <h2 className="text-sm font-semibold text-white">ℹ️ File Info</h2>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white/80 transition-colors text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="p-5 space-y-4">
          {meta?.dataUrl && meta.type.startsWith("image/") && (
            <div className="rounded-lg overflow-hidden border border-white/8">
              <img
                src={meta.dataUrl}
                alt={meta.name}
                className="w-full h-auto max-h-[160px] object-contain bg-black/40"
              />
            </div>
          )}

          {!meta?.dataUrl && (
            <div className="flex items-center justify-center h-20 text-4xl text-[#4a6b7a]">
              {item.icon}
            </div>
          )}

          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-[#4a6b7a]">Name</span>
              <span className="text-[#c8d0d8] text-right max-w-[220px] truncate">
                {meta?.name || item.label}
              </span>
            </div>
            {meta && (
              <>
                <div className="flex justify-between">
                  <span className="text-[#4a6b7a]">Type</span>
                  <span className="text-[#c8d0d8]">{meta.type || "unknown"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#4a6b7a]">Size</span>
                  <span className="text-[#c8d0d8]">{formatSize(meta.size)}</span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex justify-end px-5 py-3 border-t border-white/8">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs text-white bg-white/8 hover:bg-white/12 border border-white/10 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
