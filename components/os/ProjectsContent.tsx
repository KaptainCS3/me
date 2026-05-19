"use client"

import { useState } from "react"
import { PROJECTS } from "@/data/projects"

export function ProjectsContent() {
  const [active, setActive] = useState<number | null>(null)

  return (
    <div className="flex h-full font-mono">
      <div className="w-48 border-r shrink-0 overflow-auto py-2 border-[#1e3a4a] bg-[#060d14]">
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
            📁 {p.name.split(" ").slice(0, 2).join(" ")}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-auto p-5">
        {active === null ? (
          <div className="flex flex-col items-center justify-center h-full text-[#2a4a5a]">
            <p className="text-4xl mb-3">📁</p>
            <p className="text-sm">Select a project</p>
          </div>
        ) : (
          <div>
            <h3 className="text-base font-bold mb-1 text-white">{PROJECTS[active].name}</h3>
            <div className="flex flex-wrap gap-1 mb-4">
              {PROJECTS[active].tech.map((t) => (
                <span
                  key={t}
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: PROJECTS[active].color, color: PROJECTS[active].accent }}
                >
                  {t}
                </span>
              ))}
            </div>
            <p className="text-sm leading-relaxed text-[#a8c4d0]">{PROJECTS[active].desc}</p>
            {PROJECTS[active].stack && (
              <div className="mt-3">
                <p className="text-xs text-[#34d399] mb-1">Stack:</p>
                <div className="flex flex-wrap gap-1">
                  {PROJECTS[active].stack!.map((s) => (
                    <span key={s} className="text-xs px-2 py-0.5 rounded bg-[#0d1f16] text-[#6b8fa0] border border-[#1e3a2a]/50">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {PROJECTS[active].skills && (
              <div className="mt-3">
                <p className="text-xs text-[#60a5fa] mb-1">Skills:</p>
                <div className="flex flex-wrap gap-1">
                  {PROJECTS[active].skills!.map((s) => (
                    <span key={s} className="text-xs px-2 py-0.5 rounded bg-[#0d1f16] text-[#6b8fa0] border border-[#1e3a2a]/50">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div
              className="mt-4 p-3 rounded-lg text-xs text-[#6b8fa0]"
              style={{
                background: `${PROJECTS[active].color}33`,
                borderLeft: `3px solid ${PROJECTS[active].accent}`,
              }}
            >
              🇨🇲 Built for Cameroon & Central Africa market
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
