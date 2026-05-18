"use client"

import { useState, useEffect, useCallback } from "react"
import { DEFAULT_WALLPAPER, STORAGE_KEY } from "@/data/wallpaper"

export function useWallpaper() {
  const [wallpaper, setWallpaperState] = useState<string>(DEFAULT_WALLPAPER)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      setWallpaperState(stored)
    }
  }, [])

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
