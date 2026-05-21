"use client"

import { FiMonitor } from "react-icons/fi"

export function AboutOSContent() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center font-mono">
      <div className="text-5xl mb-4"><FiMonitor size={48} /></div>
      <h2 className="text-lg font-bold text-white mb-1">Portfolio OS</h2>
      <p className="text-xs text-[#6b8fa0] mb-5">v1.0.0</p>

      <div className="flex flex-wrap justify-center gap-1.5 mb-5">
        {["Next.js 16", "React 19", "TypeScript", "Tailwind v4"].map((t) => (
          <span
            key={t}
            className="text-[10px] px-2 py-0.5 rounded-full bg-[#0d1f16] text-[#34d399] border border-[#1e3a2a]/50"
          >
            {t}
          </span>
        ))}
      </div>

      <p className="text-xs text-[#a8c4d0] leading-relaxed max-w-xs">
        A desktop-OS-inspired developer portfolio with draggable windows, terminal emulator, and
        dynamic project showcase.
      </p>

      <div className="mt-5 pt-4 border-t border-[#1e3a4a]/50 w-full text-[10px] text-[#4a6b7a]">
        Built by KaptainCS3 &middot; <a href="https://github.com/kaptaincs3/portoflio" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#6b8fa0]">Open source on GitHub</a>
      </div>
    </div>
  )
}
