"use client"

import { useRef, useEffect } from "react"
import { WALLPAPER_PRESETS } from "@/data/wallpaper"
import type { WallpaperPreset } from "@/types/portfolio"

interface WallpaperPickerProps {
  current: string
  onSelect: (value: string) => void
  onReset: () => void
  onClose: () => void
}

export function WallpaperPicker({ current, onSelect, onReset, onClose }: WallpaperPickerProps) {
  const fileRef = useRef<HTMLInputElement>(null)
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      onSelect(`url(${reader.result})`)
    }
    reader.readAsDataURL(file)
  }

  const isPresetActive = (preset: WallpaperPreset) => current === preset.value

  return (
    <div className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div
        ref={dialogRef}
        className="w-[420px] max-h-[520px] rounded-xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.7)] border border-white/10"
        style={{ background: "rgba(15, 20, 30, 0.95)" }}
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/8">
          <h2 className="text-sm font-semibold text-white">Choose Wallpaper</h2>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white/80 transition-colors text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="p-5 overflow-y-auto max-h-[380px] space-y-4">
          <p className="text-xs text-[#6b8fa0]">Presets</p>
          <div className="grid grid-cols-2 gap-3">
            {WALLPAPER_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => onSelect(preset.value)}
                className={`relative h-20 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                  isPresetActive(preset)
                    ? "border-[#34d399] ring-1 ring-[#34d399]/30"
                    : "border-transparent hover:border-white/20"
                }`}
                style={{ background: preset.value }}
              >
                <span className="absolute bottom-1.5 left-2 text-[10px] text-white/80 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  {preset.name}
                </span>
                {isPresetActive(preset) && (
                  <span className="absolute top-1.5 right-2 text-[10px] text-[#34d399] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                    ✓
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-white/8">
            <p className="text-xs text-[#6b8fa0] mb-3">Custom Image</p>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileRef.current?.click()}
              className="w-full py-2.5 px-4 rounded-lg text-sm text-white bg-white/8 hover:bg-white/12 border border-white/10 transition-colors cursor-pointer"
            >
              📁 Upload Image
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between px-5 py-3 border-t border-white/8">
          <button
            onClick={onReset}
            className="text-xs text-[#6b8fa0] hover:text-[#fb923c] transition-colors cursor-pointer"
          >
            Reset to Default
          </button>
          <span className="text-[10px] text-[#4a6b7a]">
            {current.startsWith("url(") ? "Custom image" : "Gradient"}
          </span>
        </div>
      </div>
    </div>
  )
}
