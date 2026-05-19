"use client"

import { SKILLS } from "@/data/skills"

export function SkillsContent() {
  return (
    <div className="p-5 h-full overflow-auto font-mono">
      <p className="text-xs mb-4 text-[#4a6b7a]">// skills.json — last updated 2025</p>
      <div className="space-y-4">
        {SKILLS.map((s) => (
          <div key={s.cat}>
            <p className="text-xs mb-2 text-[#34d399]">&quot;{s.cat}&quot;: [</p>
            <div className="pl-4 flex flex-wrap gap-2">
              {s.items.map((item) => (
                <span
                  key={item}
                  className="text-xs px-2 py-1 rounded text-[#a8c4d0] bg-[#0d1f16] border border-[#1e3a2a]/50"
                >
                  {item}
                </span>
              ))}
            </div>
            <p className="text-xs mt-2 text-[#34d399]">],</p>
          </div>
        ))}
      </div>
    </div>
  )
}
