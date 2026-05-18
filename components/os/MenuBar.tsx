interface MenuBarProps {
  dateStr: string
  timeStr: string
}

const MENU_ITEMS = ["File", "View", "Window", "Help"]

export function MenuBar({ dateStr, timeStr }: MenuBarProps) {
  return (
    <div className="absolute top-0 left-0 right-0 h-6.5 bg-[rgba(5,10,18,0.7)] backdrop-blur-xl border-b border-white/6 flex items-center justify-between px-4 z-9999">
      <div className="flex gap-4 items-center">
        <span className="text-sm">🖥️</span>
        {MENU_ITEMS.map((m) => (
          <span key={m} className="text-xs text-white/70 cursor-default">
            {m}
          </span>
        ))}
      </div>
      <div className="flex gap-3 items-center">
        <span className="text-[11px] text-white/50">🇨🇲 Yaoundé</span>
        <span className="text-[11px] text-white/70">{dateStr}</span>
        <span className="text-xs font-medium text-white/90">{timeStr}</span>
      </div>
    </div>
  )
}
