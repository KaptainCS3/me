"use client"

import { useState, useEffect } from "react"
import { FiFolder, FiExternalLink, FiGithub, FiChevronRight, FiClock } from "react-icons/fi"
import { PROJECTS } from "@/data/projects"

function FadeIn({ children, show }: { children: React.ReactNode; show: boolean }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (show) {
      const t = setTimeout(() => setVisible(true), 30)
      return () => clearTimeout(t)
    }
    setVisible(false)
  }, [show])

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(6px)",
        transition: "opacity 0.25s ease, transform 0.25s ease",
      }}
    >
      {children}
    </div>
  )
}

export function ProjectsContent() {
  const [active, setActive] = useState<number | null>(null)

  return (
    <div className="flex flex-col sm:flex-row h-full font-mono">
      <div className="hidden sm:block w-52 border-r shrink-0 overflow-y-auto py-2 border-[#1e3a4a] bg-[#060d14]">
        <p className="text-xs px-3 py-1 mb-1 text-[#4a6b7a]">PORTFOLIO /</p>
        {PROJECTS.map((p, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="w-full text-left px-3 py-2 text-xs transition-all"
            style={{
              color: active === i ? "#fff" : "#6b8fa0",
              background: active === i ? `${p.color}66` : "transparent",
              borderLeft: active === i ? `2px solid ${p.accent}` : "2px solid transparent",
            }}
          >
            <FiFolder size={14} /> {p.name}
          </button>
        ))}
      </div>
      <div className="sm:hidden border-b border-[#1e3a4a] bg-[#060d14]">
        <select
          value={active ?? ""}
          onChange={(e) => setActive(e.target.value ? Number(e.target.value) : null)}
          className="w-full px-3 py-2.5 text-xs bg-[#060d14] text-white border-none outline-none appearance-none cursor-pointer"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b8fa0' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: "right 8px center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "16px",
          }}
        >
          <option value="" className="bg-[#060d14] text-[#4a6b7a]">
            Select a project...
          </option>
          {PROJECTS.map((p, i) => (
            <option key={i} value={i} className="bg-[#060d14] text-white">
              <FiFolder size={14} /> {p.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1 overflow-y-auto p-5">
        {active === null ? (
          <div className="flex flex-col items-center justify-center h-full text-[#2a4a5a]">
            <p className="text-4xl mb-3"><FiFolder size={40} /></p>
            <p className="text-sm">Select a project from the sidebar</p>
          </div>
        ) : (
          <FadeIn show={active !== null}>
            {(() => {
              const p = PROJECTS[active]
              return (
                <div>
                  <div className="flex items-baseline justify-between gap-2 mb-1">
                    <h3 className="text-base font-bold text-white">{p.name}</h3>
                    {p.period && (
                      <span className="text-[10px] shrink-0 px-2 py-0.5 rounded bg-[#0d1f16] text-[#6b8fa0] border border-[#1e3a2a]/50">
                        <FiClock size={10} /> {p.period}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {p.tech.map((t) => (
                      <span
                        key={t}
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: p.color, color: p.accent }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {p.skills && (
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mb-3">
                      {p.skills.map((s) => (
                        <span key={s} className="text-xs text-[#a8c4d0]">
                          <FiChevronRight size={10} /> {s}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="text-sm leading-relaxed text-[#a8c4d0]">{p.desc}</p>

                  {(p.url || p.github) && (
                    <div className="flex gap-2 mt-3">
                      {p.url && (
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs px-3 py-1 rounded bg-[#0d1f16] text-[#34d399] border border-[#1e3a2a]/50 hover:bg-[#1a3a2a] transition-colors"
                        >
                          <FiExternalLink size={12} /> Live Demo
                        </a>
                      )}
                      {p.github && (
                        <a
                          href={p.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs px-3 py-1 rounded bg-[#0d1f16] text-[#c084fc] border border-[#1e3a2a]/50 hover:bg-[#2a1a3a] transition-colors"
                        >
                          <FiGithub size={12} /> Source
                        </a>
                      )}
                    </div>
                  )}

                  {p.metrics && (
                    <div className="mt-3">
                      <p className="text-xs text-[#fb923c] mb-1">Key Metrics:</p>
                      <div className="flex flex-wrap gap-1">
                        {p.metrics.map((m) => (
                          <span key={m} className="text-xs px-2 py-0.5 rounded bg-[#0d1f16] text-[#fb923c] border border-[#1e3a2a]/50">
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {p.context && (
                    <div
                      className="mt-4 p-3 rounded-lg text-xs"
                      style={{
                        background: `${p.color}33`,
                        borderLeft: `3px solid ${p.accent}`,
                        color: p.accent,
                      }}
                    >
                      {p.context}
                    </div>
                  )}
                </div>
              )
            })()}
          </FadeIn>
        )}
      </div>
    </div>
  )
}
