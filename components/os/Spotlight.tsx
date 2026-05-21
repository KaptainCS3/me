"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { FiSearch, FiFolder, FiZap } from "react-icons/fi"
import type { ReactNode } from "react"
import { useAppStore } from "@/stores/appStore"
import { WINDOW_CONFIGS } from "@/data/windowConfigs"
import { PROJECTS } from "@/data/projects"
import { SKILLS } from "@/data/skills"

interface SpotlightItem {
  id: string
  type: "app" | "project" | "skill"
  label: string
  icon: ReactNode
  description?: string
}

export function Spotlight({ isOpen, onClose, onOpenApp }: { isOpen: boolean, onClose: () => void, onOpenApp: (id: string) => void }) {
  const [query, setQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const items: SpotlightItem[] = useMemo(() => {
    const list: SpotlightItem[] = []

    Object.entries(WINDOW_CONFIGS).forEach(([id, cfg]) => {
      list.push({ id, type: "app", label: cfg.title, icon: cfg.icon })
    })

    PROJECTS.forEach((p) => {
      list.push({ id: "projects", type: "project", label: p.name, icon: <FiFolder />, description: p.desc })
    })

    SKILLS.forEach((s) => {
      list.push({ id: "skills", type: "skill", label: s.cat, icon: <FiZap />, description: s.items.join(", ") })
    })

    return list
  }, [])

  const filteredItems = useMemo(() => {
    if (!query) return items.slice(0, 8)
    const q = query.toLowerCase()
    return items.filter(i => 
      i.label.toLowerCase().includes(q) || 
      i.description?.toLowerCase().includes(q)
    ).slice(0, 8)
  }, [query, items])

  useEffect(() => {
    if (isOpen) {
      setQuery("")
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 10)
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex(prev => (prev + 1) % filteredItems.length)
      }
      if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length)
      }
      if (e.key === "Enter") {
        const selected = filteredItems[selectedIndex]
        if (selected) {
          onOpenApp(selected.id)
          onClose()
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, filteredItems, selectedIndex, onClose, onOpenApp])

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-[10000] flex items-start justify-center pt-[15vh] px-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-[600px] bg-[#0a1520]/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 p-4 border-b border-white/5">
          <span className="text-xl"><FiSearch /></span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search for projects, skills, or apps..."
            className="flex-1 bg-transparent border-none outline-none text-slate-100 placeholder:text-slate-500 text-lg"
          />
          <div className="flex items-center gap-1 text-[10px] text-slate-500 bg-white/5 px-1.5 py-0.5 rounded border border-white/10">
            <span>ESC</span>
          </div>
        </div>

        <div className="max-h-[400px] overflow-y-auto py-2">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, idx) => (
              <button
                key={`${item.type}-${item.id}-${idx}`}
                onClick={() => { onOpenApp(item.id); onClose(); }}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`w-full flex items-center gap-4 px-4 py-3 text-left transition-colors ${
                  selectedIndex === idx ? "bg-accent/20 text-white" : "text-slate-400 hover:bg-white/5"
                }`}
              >
                <span className="text-lg w-8 h-8 flex items-center justify-center bg-white/5 rounded-lg border border-white/10">
                  {item.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium truncate">{item.label}</span>
                    <span className="text-[10px] uppercase tracking-wider bg-white/5 px-1.5 py-0.5 rounded text-slate-500 border border-white/10">
                      {item.type}
                    </span>
                  </div>
                  {item.description && (
                    <div className="text-xs text-slate-500 truncate mt-0.5">{item.description}</div>
                  )}
                </div>
                {selectedIndex === idx && (
                  <span className="text-[10px] text-accent font-bold">RETURN ↵</span>
                )}
              </button>
            ))
          ) : (
            <div className="p-8 text-center text-slate-500 italic">
              No results for &ldquo;{query}&rdquo;
            </div>
          )}
        </div>
        
        <div className="p-2 border-t border-white/5 bg-white/2 flex items-center justify-between text-[10px] text-slate-600">
          <div className="flex items-center gap-4 ml-2">
            <span className="flex items-center gap-1">↑↓ to navigate</span>
            <span className="flex items-center gap-1">↵ to select</span>
          </div>
          <div className="mr-2">Spotlight Search</div>
        </div>
      </div>
    </div>
  )
}
