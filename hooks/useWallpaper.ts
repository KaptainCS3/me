"use client"

import { useState, useCallback } from "react"
import { DEFAULT_WALLPAPER, STORAGE_KEY } from "@/data/wallpaper"

export function useWallpaper() {
  const [wallpaper, setWallpaperState] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(STORAGE_KEY) ?? DEFAULT_WALLPAPER
    }
    return DEFAULT_WALLPAPER
  })

  const setWallpaper = useCallback((value: string) => {
    setWallpaperState(value)
    localStorage.setItem(STORAGE_KEY, value)
  }, [])

  const resetWallpaper = useCallback(() => {
    setWallpaperState(DEFAULT_WALLPAPER)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return { wallpaper, setWallpaper, resetWallpaper }
}
