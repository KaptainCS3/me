"use client"

import { useEffect, useRef } from "react"
import { FiAlertTriangle } from "react-icons/fi"

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: "danger" | "default"
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel()
    }
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-20000 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        ref={dialogRef}
        className="w-[90vw] max-w-80 rounded-xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.7)] border border-white/10"
        style={{ background: "rgba(15, 20, 30, 0.95)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/8">
          <span className={variant === "danger" ? "text-red-400" : "text-accent"}>
            <FiAlertTriangle size={18} />
          </span>
          <h2 className="text-sm font-semibold text-white">{title}</h2>
        </div>
        <div className="px-5 py-4">
          <p className="text-xs text-slate-400 leading-relaxed">{message}</p>
        </div>
        <div className="flex justify-end gap-2 px-5 py-3 border-t border-white/8">
          <button
            onClick={onCancel}
            className="px-4 py-1.5 rounded-lg text-xs text-white bg-white/8 hover:bg-white/12 border border-white/10 transition-colors cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-1.5 rounded-lg text-xs text-white border transition-colors cursor-pointer ${
              variant === "danger"
                ? "bg-red-600 hover:bg-red-500 border-red-500/50"
                : "bg-accent hover:opacity-90 border-accent/50"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
