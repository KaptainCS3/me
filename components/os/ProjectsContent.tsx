"use client"

import { useState, useRef, useEffect } from "react"
import { FiFolder, FiExternalLink, FiGithub, FiChevronRight, FiClock, FiShield, FiZap, FiGlobe, FiLayers, FiLayout, FiMaximize2 } from "react-icons/fi"
import { PROJECTS } from "@/data/projects"

export function ProjectsContent() {
  const [active, setActive] = useState(0)
  const [hoveredMetric, setHoveredMetric] = useState<number | null>(null)
  
  // 3D Tilt Effect Refs
  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: x * 10, y: y * -10 })
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
  }

  const p = PROJECTS[active]

  return (
    <div className="h-full flex flex-col sm:flex-row font-mono text-sm bg-[#06090c] overflow-hidden">
      {/* Sidebar: Project Selection */}
      <aside className="hidden sm:flex w-64 flex-col border-r border-[#1e3a4a]/30 bg-[#0d1117] shrink-0">
        <div className="p-4 border-b border-[#1e3a4a]/20">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#4a6b7a] font-bold">Project Explorer</p>
        </div>
        <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
          {PROJECTS.map((project, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-all relative group ${
                active === i ? "bg-[#1e3a4a]/20" : "hover:bg-white/5"
              }`}
            >
              {active === i && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#34d399]" />
              )}
              <FiFolder size={16} className={active === i ? "text-[#34d399]" : "text-[#4a6b7a] group-hover:text-white transition-colors"} />
              <div className="min-w-0">
                <p className={`text-xs truncate font-medium ${active === i ? "text-white" : "text-[#6b8fa0] group-hover:text-white"}`}>
                  {project.name}
                </p>
                <p className="text-[9px] text-[#4a6b7a] uppercase tracking-wider">{project.period}</p>
              </div>
            </button>
          ))}
        </div>
        <div className="p-4 bg-[#06090c] border-t border-[#1e3a4a]/20">
          <div className="flex items-center gap-2 text-[10px] text-[#4a6b7a]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse" />
            VFS-LINK: STABLE
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Subtle Background Accent */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none transition-all duration-1000"
          style={{ 
            background: `radial-gradient(circle at 50% 50%, ${p.accent}, transparent 70%)` 
          }}
        />

        {/* Top Breadcrumb */}
        <header className="px-6 py-3 border-b border-[#1e3a4a]/30 bg-[#0d1117]/80 backdrop-blur-md flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-[10px] text-[#4a6b7a]">
             <span>portfolio</span>
             <span>/</span>
             <span className="text-white">projects</span>
             <span>/</span>
             <span className="text-[#34d399]">{p.name.toLowerCase().replace(/\s+/g, '-')}.sys</span>
          </div>
          <div className="flex gap-4">
             {p.url && (
                <a href={p.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[10px] text-[#34d399] hover:underline">
                  <FiGlobe size={12} /> LIVE_DEMO
                </a>
             )}
             {p.github && (
                <a href={p.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[10px] text-[#c084fc] hover:underline">
                  <FiGithub size={12} /> SOURCE_CODE
                </a>
             )}
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar relative z-10">
          
          {/* Hero Section */}
          <section className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#34d399]/10 text-[#34d399] text-[9px] font-bold border border-[#34d399]/20">STABLE_RELEASE</span>
                <span className="text-[#4a6b7a] text-[10px]">{p.period}</span>
              </div>
              <h2 className="text-3xl font-bold text-white tracking-tighter">{p.name}</h2>
              <p className="text-sm text-[#a8c4d0] leading-relaxed max-w-2xl">{p.desc}</p>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Interactive Preview (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div 
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="relative group perspective-1000"
              >
                {/* Mini-Browser Frame */}
                <div 
                  className="rounded-xl border border-[#1e3a4a]/40 bg-[#0d1117] overflow-hidden shadow-2xl transition-transform duration-200 ease-out"
                  style={{ 
                    transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
                    boxShadow: `0 20px 50px -12px ${p.accent}20`
                  }}
                >
                  {/* Browser Chrome */}
                  <div className="bg-[#161b22] px-4 py-2 flex items-center gap-3 border-b border-[#1e3a4a]/20">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                    </div>
                    <div className="flex-1 bg-[#0d1117] rounded-md px-3 py-1 text-[9px] text-[#4a6b7a] flex items-center justify-between">
                      <span className="truncate">{p.url || `https://${p.name.toLowerCase().replace(/\s+/g, '')}.app`}</span>
                      <FiMaximize2 size={10} />
                    </div>
                  </div>
                  {/* Viewport Mockup */}
                  <div className="aspect-video bg-[#06090c] p-6 relative overflow-hidden group/viewport">
                    {/* Stylized UI Skeletons */}
                    <div className="space-y-4 animate-pulse opacity-40">
                      <div className="h-4 w-1/3 bg-[#1e3a4a]/40 rounded" />
                      <div className="grid grid-cols-3 gap-3">
                        <div className="h-20 bg-[#1e3a4a]/20 rounded-lg border border-[#1e3a4a]/10" />
                        <div className="h-20 bg-[#1e3a4a]/20 rounded-lg border border-[#1e3a4a]/10" />
                        <div className="h-20 bg-[#1e3a4a]/20 rounded-lg border border-[#1e3a4a]/10" />
                      </div>
                      <div className="h-32 bg-[#1e3a4a]/10 rounded-xl border border-[#1e3a4a]/10 flex items-center justify-center">
                         <FiLayout size={32} className="text-[#1e3a4a]/40" />
                      </div>
                    </div>
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/viewport:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                       <button className="px-6 py-2.5 rounded-full bg-white text-black text-xs font-bold tracking-widest hover:scale-105 transition-transform">
                          EXPLORE_INTERFACE
                       </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Architecture Blueprint */}
              <div className="p-5 rounded-xl bg-[#0d1117]/50 border border-[#1e3a4a]/20 space-y-4">
                 <h3 className="text-[10px] text-[#4a6b7a] font-bold uppercase tracking-wider flex items-center gap-2">
                   <FiLayers size={14} /> Architecture_Blueprint
                 </h3>
                 <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 rounded bg-white/5 border border-white/5">
                       <p className="text-[9px] text-[#4a6b7a] mb-1 uppercase">Frontend</p>
                       <p className="text-xs text-white font-medium">{p.tech[0]}</p>
                    </div>
                    <div className="p-3 rounded bg-white/5 border border-white/5 relative">
                       <p className="text-[9px] text-[#4a6b7a] mb-1 uppercase">Compute</p>
                       <p className="text-xs text-white font-medium">Serverless</p>
                       <div className="absolute left-[-10px] top-1/2 -translate-y-1/2 text-[#1e3a4a]">→</div>
                       <div className="absolute right-[-10px] top-1/2 -translate-y-1/2 text-[#1e3a4a]">→</div>
                    </div>
                    <div className="p-3 rounded bg-white/5 border border-white/5">
                       <p className="text-[9px] text-[#4a6b7a] mb-1 uppercase">Database</p>
                       <p className="text-xs text-white font-medium">{p.tech[4] || "NoSQL"}</p>
                    </div>
                 </div>
              </div>
            </div>

            {/* Right: Technical Specs (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Performance Metrics */}
              <section className="space-y-4">
                <h3 className="text-[10px] text-[#4a6b7a] font-bold uppercase tracking-wider">System_Performance</h3>
                <div className="grid grid-cols-2 gap-3">
                  {p.metrics?.map((m, i) => (
                    <div 
                      key={i}
                      onMouseEnter={() => setHoveredMetric(i)}
                      onMouseLeave={() => setHoveredMetric(null)}
                      className="p-3 rounded-lg bg-[#0d1117] border border-[#1e3a4a]/30 hover:border-[#34d399]/40 transition-all cursor-default"
                    >
                      <p className="text-[9px] text-[#4a6b7a] mb-1 uppercase tracking-tight">Metric_0{i+1}</p>
                      <p className="text-xs text-white font-bold leading-tight">{m}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Tech Stack Config */}
              <section className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#1e3a4a]/20 pb-1">
                   <h3 className="text-[10px] text-[#4a6b7a] font-bold uppercase tracking-wider">Dependency_Graph</h3>
                   <span className="text-[9px] text-[#34d399]">config.json</span>
                </div>
                <div className="space-y-2">
                   {p.tech.map((t, i) => (
                     <div key={i} className="flex items-center justify-between group">
                        <div className="flex items-center gap-2">
                           <FiChevronRight size={10} className="text-[#34d399] opacity-50" />
                           <span className="text-xs text-[#a8c4d0] group-hover:text-white transition-colors">{t}</span>
                        </div>
                        <span className="text-[9px] text-[#4a6b7a]">installed</span>
                     </div>
                   ))}
                </div>
              </section>

              {/* Context / Mission */}
              <div 
                className="p-4 rounded-lg text-xs leading-relaxed italic relative overflow-hidden"
                style={{ background: `${p.color}22`, borderLeft: `4px solid ${p.accent}` }}
              >
                <div className="relative z-10 text-white opacity-80">
                  {p.context}
                </div>
                <div className="absolute right-2 bottom-2 opacity-10">
                   <FiShield size={40} style={{ color: p.accent }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <footer className="px-6 py-4 bg-[#0d1117] border-t border-[#1e3a4a]/30 flex items-center justify-between shrink-0 relative z-10">
           <div className="flex items-center gap-6">
              <div className="flex flex-col">
                 <span className="text-[9px] text-[#4a6b7a] uppercase">Current_Selection</span>
                 <span className="text-xs text-white font-bold">{p.name}</span>
              </div>
           </div>
           <div className="flex gap-3">
              <button 
                onClick={() => setActive((active + 1) % PROJECTS.length)}
                className="px-4 py-2 rounded bg-white/5 border border-white/10 text-[10px] text-white hover:bg-white/10 transition-all font-bold tracking-widest"
              >
                NEXT_PROJECT
              </button>
              {p.url && (
                <button 
                  onClick={() => window.open(p.url, '_blank')}
                  className="px-6 py-2 rounded bg-[#34d399] text-[#060d14] text-[10px] font-bold hover:scale-105 transition-all shadow-[0_0_15px_rgba(52,211,153,0.3)] tracking-widest"
                >
                  DEPLOY_LIVE
                </button>
              )}
           </div>
        </footer>
      </main>

      {/* Tilt CSS */}
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
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
