"use client"

import { useAppStore } from "@/stores/appStore"

const ACCENT_COLORS = [
  { name: "Emerald", value: "#34d399" },
  { name: "Blue", value: "#60a5fa" },
  { name: "Purple", value: "#a78bfa" },
  { name: "Pink", value: "#f472b6" },
  { name: "Amber", value: "#fbbf24" },
  { name: "Red", value: "#f87171" },
]

const THEMES = [
  { id: "dark", name: "Default Dark", icon: "🌙" },
  { id: "matrix", name: "The Matrix", icon: "📟" },
  { id: "retro", name: "Classic 95", icon: "💾" },
]

export function SettingsContent() {
  const accentColor = useAppStore((s) => s.accentColor)
  const setAccentColor = useAppStore((s) => s.setAccentColor)
  const themeMode = useAppStore((s) => s.themeMode)
  const setThemeMode = useAppStore((s) => s.setThemeMode)
  const isMuted = useAppStore((s) => s.isMuted)
  const setIsMuted = useAppStore((s) => s.setIsMuted)

  return (
    <div className="p-6 flex flex-col gap-8 h-full overflow-y-auto text-slate-200">
      <section>
        <h3 className="text-sm font-semibold mb-4 text-slate-400 uppercase tracking-wider">Appearance</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {THEMES.map((theme) => (
            <button
              key={theme.id}
              onClick={() => setThemeMode(theme.id as any)}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                themeMode === theme.id
                  ? "bg-accent/10 border-accent text-accent"
                  : "bg-white/5 border-white/10 hover:bg-white/8 text-slate-300"
              }`}
            >
              <span className="text-xl">{theme.icon}</span>
              <span className="text-sm font-medium">{theme.name}</span>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-sm font-semibold mb-4 text-slate-400 uppercase tracking-wider">Accent Color</h3>
        <div className="flex flex-wrap gap-3">
          {ACCENT_COLORS.map((color) => (
            <button
              key={color.value}
              onClick={() => setAccentColor(color.value)}
              className={`w-10 h-10 rounded-full border-2 transition-all transform hover:scale-110 ${
                accentColor === color.value
                  ? "border-white scale-110 shadow-[0_0_15px_var(--accent)]"
                  : "border-transparent"
              }`}
              style={{ backgroundColor: color.value }}
              title={color.name}
            />
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-sm font-semibold mb-4 text-slate-400 uppercase tracking-wider">Sound & Notifications</h3>
        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="flex flex-col">
            <span className="text-sm font-medium">System Sounds</span>
            <span className="text-xs text-slate-500">Enable UI interactions sounds</span>
          </div>
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              !isMuted ? "bg-accent" : "bg-slate-700"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                !isMuted ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </section>

      <div className="mt-auto pt-8 text-center text-[10px] text-slate-600">
        PortfolioOS v1.0.0-stable
        <br />
        Designed with ❤️ in Douala
      </div>
    </div>
  )
}
