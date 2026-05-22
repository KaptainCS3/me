"use client"

import { SKILLS } from "@/data/skills"
import { FiChevronRight } from "react-icons/fi"

export function SkillsContent() {
  return (
    <div className="h-full flex flex-col font-mono text-sm bg-[#06090c] overflow-hidden select-none">
      {/* Top Header/Breadcrumb */}
      <div className="px-4 py-2 border-b border-[#1e3a4a]/30 bg-[#0d1117] flex items-center gap-2 text-[10px] text-[#4a6b7a] shrink-0">
        <span className="opacity-50">portfolio</span>
        <span>/</span>
        <span className="opacity-50">systems</span>
        <span>/</span>
        <span className="text-[#34d399]">expertise.bin</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-16 sm:pb-24 space-y-8 custom-scrollbar">
        {/* Intro Section */}
        <section className="space-y-1">
          <p className="text-[#4a6b7a] text-xs">// System capability matrix — high priority modules</p>
          <h2 className="text-xl font-bold text-white tracking-tight uppercase">Capability Matrix v1</h2>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
          {SKILLS.map((s, idx) => (
            <div 
              key={s.cat} 
              className="group flex flex-col p-4 rounded-xl bg-[#0d1117]/50 border border-[#1e3a4a]/20 hover:border-white/10 transition-all duration-300"
            >
              {/* Pillar Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-white/5 text-[#34d399] group-hover:scale-110 transition-transform duration-500">
                  {s.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[10px] text-[#4a6b7a] font-bold uppercase tracking-widest leading-none mb-1">Module 0{idx + 1}</h3>
                  <h4 className="text-xs text-white font-bold truncate uppercase">{s.cat}</h4>
                </div>
              </div>

              {/* System Load Bar (Proficiency) */}
              <div className="space-y-1.5 mb-5">
                <div className="flex justify-between items-center text-[9px] text-[#4a6b7a] font-bold">
                  <span>SYSTEM LOAD</span>
                  <span className={s.level && s.level > 90 ? "text-[#34d399]" : "text-[#60a5fa]"}>{s.level}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden flex border border-white/5">
                  <div 
                    className={`h-full transition-all duration-1000 ease-out ${s.level && s.level > 90 ? "bg-[#34d399]" : "bg-[#60a5fa]"}`}
                    style={{ width: `${s.level}%` }}
                  />
                </div>
              </div>

              {/* Skills List */}
              <div className="space-y-2">
                {s.items.map((item) => (
                  <div key={item} className="flex items-center gap-2 group/item">
                    <FiChevronRight size={10} className="text-[#34d399] opacity-30 group-hover/item:opacity-100 transition-opacity" />
                    <span className="text-[11px] text-[#a8c4d0] group-hover/item:text-white transition-colors">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="flex items-center bg-[#0d1117] border-t border-[#1e3a4a]/30 h-8 text-[10px] overflow-hidden shrink-0">
         <div className="flex items-center bg-[#34d399] text-[#060d14] px-3 h-full font-bold relative mr-3 uppercase">
            Optimization: Peak
            <div className="absolute right-3 top-0 bottom-0 w-0 h-0 border-y-16 border-y-transparent border-l-3 border-l-[#34d399]" />
         </div>
         <div className="flex items-center gap-4 text-[#4a6b7a]">
            <span className="flex items-center gap-1 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse" />
              STABLE RELEASE
            </span>
            <span className="hidden sm:inline opacity-50 italic tracking-wider uppercase">Runtime: Production</span>
         </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e3a4a;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #34d399;
        }
      `}</style>
    </div>
  )
}
