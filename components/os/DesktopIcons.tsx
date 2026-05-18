const DESKTOP_ITEMS = [
  { icon: "🌍", label: "Cameroon.travel" },
  { icon: "📄", label: "Resume.pdf" },
]

export function DesktopIcons() {
  return (
    <div className="absolute top-9 right-4 flex flex-col gap-3">
      {DESKTOP_ITEMS.map((item) => (
        <div
          key={item.label}
          className="flex flex-col items-center gap-0.5 cursor-default"
        >
          <div className="w-11 h-11 rounded-lg bg-white/7 border border-white/10 flex items-center justify-center text-2xl">
            {item.icon}
          </div>
          <span className="text-[10px] text-white/70 [text-shadow:0_1px_3px_rgba(0,0,0,0.8)]">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  )
}
