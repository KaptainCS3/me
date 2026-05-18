"use client"

import { useState } from "react"
import type { DockApp } from "@/types/portfolio"

interface DockItemProps {
  app: DockApp
  isOpen: boolean
  onClick: () => void
}

export function DockItem({ app, isOpen, onClick }: DockItemProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <div className="flex flex-col items-center relative">
      {hovered && (
        <div className="absolute bottom-[65px] bg-black/75 backdrop-blur-md text-white text-[11px] px-2.5 py-1 rounded-md whitespace-nowrap border border-[#1e3a4a]/50 pointer-events-none">
          {app.label}
        </div>
      )}
      <button
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="w-12 h-12 rounded-xl bg-white/8 border border-white/12 text-2xl cursor-pointer transition-all duration-150 ease-in-out flex items-center justify-center hover:scale-115 hover:-translate-y-1.5"
      >
        {app.icon}
      </button>
      {isOpen && (
        <div className="w-1 h-1 rounded-full bg-[#34d399] mt-0.5" />
      )}
    </div>
  )
}
