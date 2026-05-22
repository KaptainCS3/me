"use client"

import { useEffect, useRef, useState } from "react"
import { FiInfo, FiX, FiImage, FiFile, FiVideo, FiMusic, FiFolder } from "react-icons/fi"
import type { ReactNode } from "react"
import type { DesktopItem } from "@/types/portfolio"
import { getBlob } from "@/lib/idb"
import { fileTypeBadge } from "@/lib/fileThumbnails"

interface FileInfoModalProps {
  item: DesktopItem
  onClose: () => void
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getFileIcon(item: DesktopItem): ReactNode {
  if (item.fileMeta?.thumbnail) {
    return (
      <img
        src={item.fileMeta.thumbnail}
        alt=""
        className="w-full h-full object-cover rounded-lg"
      />
    )
  }
  if (item.fileMeta?.type.startsWith("image/")) return <FiImage size={32} />
  if (item.fileMeta?.type.startsWith("text/")) return <FiFile size={32} />
  if (item.fileMeta?.type === "application/pdf") return <FiFile size={32} />
  if (item.fileMeta?.type.startsWith("video/")) return <FiVideo size={32} />
  if (item.fileMeta?.type.startsWith("audio/")) return <FiMusic size={32} />
  return <FiFolder size={32} />
}

export function FileInfoModal({ item, onClose }: FileInfoModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [previewType, setPreviewType] = useState<string>("")

  useEffect(() => {
    const meta = item.fileMeta
    if (!meta) return

    if (meta.dataUrl) {
      setPreviewUrl(meta.dataUrl)
      setPreviewType(meta.type)
      return
    }

    if (meta.storageId) {
      getBlob(meta.storageId).then((blob) => {
        if (blob) {
          setPreviewUrl(URL.createObjectURL(blob))
          setPreviewType(blob.type)
        }
      })
    }
  }, [item.fileMeta])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    const handleClickOutside = (e: Event) => {
      if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener("keydown", handleEscape)
    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("touchstart", handleClickOutside, { passive: true })
    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("touchstart", handleClickOutside)
    }
  }, [onClose])

  const meta = item.fileMeta

  return (
    <div className="fixed inset-0 z-10001 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div
        ref={dialogRef}
        className="w-[90vw] max-w-85 rounded-xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.7)] border border-white/10"
        style={{ background: "rgba(15, 20, 30, 0.95)" }}
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/8">
          <h2 className="text-sm font-semibold text-white"><FiInfo size={16} className="inline mr-1" /> File Info</h2>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white/80 transition-colors text-lg cursor-pointer"
          >
            <FiX />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {previewUrl && previewType.startsWith("image/") && (
            <div className="rounded-lg overflow-hidden border border-white/8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt={meta?.name || ""}
                className="w-full h-auto max-h-40 object-contain bg-black/40"
              />
            </div>
          )}

          {previewUrl && previewType.startsWith("video/") && (
            <div className="rounded-lg overflow-hidden border border-white/8 bg-black/60">
              <video src={previewUrl} controls className="w-full max-h-40" />
            </div>
          )}

          {previewUrl && previewType.startsWith("audio/") && (
            <div className="rounded-lg overflow-hidden border border-white/8 bg-black/60 p-3">
              <audio src={previewUrl} controls className="w-full" />
            </div>
          )}

          {previewUrl && previewType === "application/pdf" && (
            <div className="rounded-lg overflow-hidden border border-white/8 bg-black/60" style={{ height: 200 }}>
              <embed src={previewUrl} type="application/pdf" className="w-full h-full" />
            </div>
          )}

          {!previewUrl && (
            <div className="flex items-center justify-center h-20 text-4xl text-[#4a6b7a]">
              <div className="w-14 h-14 rounded-lg overflow-hidden flex items-center justify-center">
                {getFileIcon(item)}
              </div>
            </div>
          )}

          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-[#4a6b7a]">Name</span>
              <span className="text-[#c8d0d8] text-right max-w-55 truncate">
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
                {meta.thumbnail && (
                  <div className="flex justify-between">
                    <span className="text-[#4a6b7a]">Preview</span>
                    <span className="text-[#c8d0d8]">{fileTypeBadge(meta.type)}</span>
                  </div>
                )}
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
