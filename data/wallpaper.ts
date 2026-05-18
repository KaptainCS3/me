import type { WallpaperPreset } from "@/types/portfolio"

export const DEFAULT_WALLPAPER = `radial-gradient(ellipse at 20% 50%, #0d2137 0%, transparent 60%),
radial-gradient(ellipse at 80% 20%, #0a3d2b 0%, transparent 55%),
radial-gradient(ellipse at 60% 80%, #1a0d2e 0%, transparent 50%),
linear-gradient(135deg, #0a0f1e 0%, #0d1f16 40%, #0f0a1a 100%)`

export const WALLPAPER_PRESETS: WallpaperPreset[] = [
  {
    id: "deep-forest",
    name: "Deep Forest",
    value: DEFAULT_WALLPAPER,
  },
  {
    id: "midnight",
    name: "Midnight",
    value: `radial-gradient(ellipse at 25% 40%, #0a1628 0%, transparent 60%),
radial-gradient(ellipse at 75% 60%, #1a0a2e 0%, transparent 55%),
radial-gradient(ellipse at 50% 80%, #0c1445 0%, transparent 50%),
linear-gradient(135deg, #050a18 0%, #0a0a20 40%, #100a1a 100%)`,
  },
  {
    id: "ember",
    name: "Ember",
    value: `radial-gradient(ellipse at 30% 30%, #2e140a 0%, transparent 55%),
radial-gradient(ellipse at 70% 70%, #1a0a05 0%, transparent 50%),
radial-gradient(ellipse at 50% 50%, #3a1a05 0%, transparent 60%),
linear-gradient(135deg, #1a0a05 0%, #2a1005 40%, #0f0a08 100%)`,
  },
  {
    id: "ocean",
    name: "Ocean",
    value: `radial-gradient(ellipse at 20% 30%, #0a1a2e 0%, transparent 55%),
radial-gradient(ellipse at 80% 40%, #05201a 0%, transparent 50%),
radial-gradient(ellipse at 50% 70%, #0a2a2e 0%, transparent 60%),
linear-gradient(135deg, #050a15 0%, #0a1518 40%, #080a12 100%)`,
  },
  {
    id: "minimal",
    name: "Minimal",
    value: `linear-gradient(135deg, #0a0a0f 0%, #14141a 50%, #0f0f14 100%)`,
  },
]

export const STORAGE_KEY = "portfolio-wallpaper"
