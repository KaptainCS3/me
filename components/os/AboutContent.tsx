"use client"

import Image from "next/image"
import { FiUser, FiChevronRight, FiLinkedin, FiGithub, FiMail, FiMapPin, FiCalendar, FiTerminal, FiCpu, FiShield, FiZap, FiBookOpen } from "react-icons/fi"
import { RESUME } from "@/data/about"

export function AboutContent() {
  const metrics = [
    { label: "Experience", value: "3+ Years", icon: FiCalendar },
    { label: "Architecture", value: "8+ Modules", icon: FiCpu },
    { label: "Security", value: "E2E Ready", icon: FiShield },
    { label: "Performance", value: "99.9% Focus", icon: FiZap },
  ]

  return (
    <div className="h-full flex flex-col font-mono text-sm bg-[#06090c] overflow-hidden select-none">
      {/* Top Header/Breadcrumb */}
      <div className="px-4 py-2 border-b border-[#1e3a4a]/30 bg-[#0d1117] flex items-center gap-2 text-[10px] text-[#4a6b7a] shrink-0">
        <span className="opacity-50">portfolio</span>
        <span>/</span>
        <span className="opacity-50">identity</span>
        <span>/</span>
        <span className="text-[#34d399]">engineer.profile</span>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 min-h-full items-start">
          
          {/* Left Column: Profile Card (4 cols) - Sticky on Desktop */}
          <aside className="lg:col-span-4 lg:border-r border-[#1e3a4a]/20 bg-[#0d1117]/30 p-6 space-y-8 lg:sticky lg:top-0 h-auto">
            <div className="space-y-4">
              <div className="relative w-20 h-20 group">
                <div className="absolute inset-0 bg-[#34d399]/20 blur-xl rounded-full animate-pulse" />
                <div className="relative w-full h-full rounded-2xl bg-[#0a3d2b] border border-[#34d399]/30 flex items-center justify-center text-[#34d399] shadow-2xl overflow-hidden">
                  {RESUME.avatar ? (
                    <Image
                      src={RESUME.avatar}
                      alt={RESUME.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  ) : (
                    <FiUser size={40} />
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-white tracking-tight">{RESUME.name}</h2>
                <p className="text-[10px] text-[#34d399] font-bold uppercase tracking-widest leading-none">Full Stack Software Engineer</p>
                <div className="flex items-center gap-2 text-[10px] text-[#4a6b7a] pt-1">
                  <FiMapPin size={10} /> <span>Douala, Cameroon / Remote</span>
                </div>
              </div>
            </div>

            {/* System Metrics Grid */}
            <div className="grid grid-cols-2 gap-3">
              {metrics.map((m) => (
                <div key={m.label} className="p-3 rounded-xl bg-[#0d1117] border border-[#1e3a4a]/20 space-y-1 group hover:border-[#34d399]/30 transition-colors">
                  <m.icon className="text-[#4a6b7a] group-hover:text-[#34d399] transition-colors" size={14} />
                  <div>
                    <p className="text-[9px] text-[#4a6b7a] uppercase font-bold">{m.label}</p>
                    <p className="text-[11px] text-white font-bold">{m.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Code-Inspired Bio */}
            <div className="space-y-3">
               <h3 className="text-[10px] text-[#4a6b7a] font-bold uppercase tracking-widest border-b border-[#1e3a4a]/20 pb-1">System.Bio()</h3>
               <div className="text-[11px] text-[#a8c4d0] leading-relaxed relative">
                  <span className="text-[#34d399] absolute -left-2 opacity-50">/**</span>
                  <p className="pl-3 py-1 italic">
                    Architecting high-scale, secure, and performant digital ecosystems. 
                    Passionate about Next.js, TypeScript, and the intersection of finance and technology.
                  </p>
                  <span className="text-[#34d399] absolute -left-2 opacity-50 bottom-0"> */</span>
               </div>
            </div>

            {/* Action Links */}
            <div className="flex flex-col gap-2 pt-4 border-t border-[#1e3a4a]/20">
              <a href={`https://${RESUME.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-all text-xs group">
                <span className="flex items-center gap-2"><FiLinkedin className="text-[#60a5fa]" /> LinkedIn</span>
                <FiChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a href={`https://${RESUME.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-all text-xs group">
                <span className="flex items-center gap-2"><FiGithub className="text-[#c084fc]" /> GitHub</span>
                <FiChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
          </aside>

          {/* Right Column: Professional Log (8 cols) */}
          <main className="lg:col-span-8 p-6 sm:p-8 pb-16 sm:pb-24 space-y-10">
            
            {/* Experience Timeline */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] text-[#34d399] font-bold uppercase tracking-widest flex items-center gap-2">
                  <FiTerminal /> Professional History.log
                </h3>
                <span className="text-[9px] text-[#4a6b7a] hidden sm:inline uppercase tracking-widest italic">Sorted by Recency</span>
              </div>

              <div className="space-y-8 relative">
                {/* Vertical Line */}
                <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[#1e3a4a]/30" />

                {RESUME.experience.map((exp, i) => (
                  <div key={i} className="relative pl-8 group">
                    {/* Node Dot */}
                    <div className="absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full bg-[#06090c] border-2 border-[#1e3a4a] group-hover:border-[#34d399] transition-colors z-10" />
                    
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                        <div>
                          <h4 className="text-sm font-bold text-white group-hover:text-[#34d399] transition-colors">{exp.role}</h4>
                          <p className="text-[11px] text-[#60a5fa] font-bold uppercase tracking-wider">{exp.company}</p>
                        </div>
                        <span className="text-[10px] text-[#4a6b7a] font-bold">{exp.period}</span>
                      </div>
                      
                      <ul className="space-y-1.5">
                        {exp.highlights.map((h, hi) => (
                          <li key={hi} className="text-[11px] text-[#a8c4d0] leading-relaxed flex gap-2">
                            <span className="text-[#34d399] opacity-50 shrink-0 mt-0.5">»</span>
                            {h}
                          </li>
                        ))}
                      </ul>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {exp.tech.map((t) => (
                          <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-[#1e3a4a]/20 text-[#6b8fa0] border border-[#1e3a4a]/30 uppercase font-bold tracking-tighter hover:border-[#34d399]/40 hover:text-white transition-all cursor-default">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Academic Layer */}
            <section className="space-y-6 pt-6 border-t border-[#1e3a4a]/10">
              <h3 className="text-[10px] text-[#34d399] font-bold uppercase tracking-widest flex items-center gap-2">
                <FiBookOpen /> Academic Infrastructure
              </h3>
              <div className="space-y-4">
                {RESUME.education.map((edu, i) => (
                  <div key={i} className="p-4 rounded-xl bg-[#0d1117]/50 border border-[#1e3a4a]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:border-[#34d399]/30 transition-all">
                    <div>
                       <h4 className="text-xs font-bold text-white">{edu.degree}</h4>
                       <p className="text-[10px] text-[#4a6b7a] font-bold uppercase tracking-widest pt-0.5">{edu.institution}</p>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-[#34d399] font-bold">
                       <FiMapPin size={10} /> {edu.location}
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </main>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="flex items-center bg-[#0d1117] border-t border-[#1e3a4a]/30 h-8 text-[10px] overflow-hidden shrink-0">
         <div className="flex items-center bg-[#1e3a4a] text-white px-3 h-full font-bold relative mr-3 uppercase">
            STATUS: ACTIVE
            <div className="absolute right-[-12px] top-0 bottom-0 w-0 h-0 border-y-[16px] border-y-transparent border-l-[12px] border-l-[#1e3a4a]" />
         </div>
         <div className="flex items-center gap-4 text-[#4a6b7a]">
            <span className="flex items-center gap-1 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse" />
              TRANSMITTING EXPERTISE
            </span>
            <span className="hidden sm:inline opacity-50 italic tracking-wider uppercase">Build: Stable.v3</span>
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
