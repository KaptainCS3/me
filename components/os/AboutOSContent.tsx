"use client"

import { useState } from "react"
import { FiMonitor, FiCpu, FiHardDrive, FiActivity, FiExternalLink, FiRefreshCw, FiCheck } from "react-icons/fi"

export function AboutOSContent() {
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateStatus, setUpdateStatus] = useState<"idle" | "checking" | "latest">("idle")

  const handleUpdateCheck = () => {
    setUpdateStatus("checking")
    setIsUpdating(true)
    setTimeout(() => {
      setUpdateStatus("latest")
      setIsUpdating(false)
      setTimeout(() => setUpdateStatus("idle"), 3000)
    }, 2000)
  }

  const specs = [
    { icon: FiCpu, label: "Processor", value: "Human Intelligence 2.0" },
    { icon: FiActivity, label: "Memory", value: "Coffee-powered 16GB" },
    { icon: FiMonitor, label: "Graphics", value: "Imagination Core X" },
    { icon: FiHardDrive, label: "Storage", value: "Unlimited Creativity" },
  ]

  const modules = [
    { name: "Next.js", ver: "16.2" },
    { name: "React", ver: "19.2" },
    { name: "Zustand", ver: "5.0" },
    { name: "Tailwind", ver: "4.0" },
    { name: "TypeScript", ver: "5.7" },
    { name: "VFS-Kernel", ver: "v1.0" },
    { name: "Terminal", ver: "bash-5.2" },
    { name: "PDF-Engine", ver: "10.4" },
    { name: "Lucide", ver: "1.16" },
  ]

  return (
    <div className="h-full flex flex-col font-mono text-sm bg-[#06090c] overflow-hidden select-none">
      <div className="flex-1 flex flex-col md:flex-row p-6 gap-8 overflow-y-auto custom-scrollbar">
        {/* Left Column: Visual Icon */}
        <div className="flex flex-col items-center justify-center md:w-1/3 space-y-4 shrink-0">
          <div className="relative group">
            <div className="absolute inset-0 bg-[#34d399]/20 blur-2xl rounded-full group-hover:bg-[#34d399]/30 transition-all" />
            <div className="relative w-24 h-24 rounded-2xl bg-[#0d1117] border border-[#1e3a4a]/30 flex items-center justify-center text-[#34d399] shadow-2xl">
              <FiMonitor size={48} className="drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-white tracking-tight">PortfolioOS</h2>
            <p className="text-[10px] text-[#4a6b7a] font-bold uppercase tracking-[0.2em]">Build 2026.05.21</p>
          </div>
        </div>

        {/* Right Column: System Details */}
        <div className="flex-1 space-y-6">
          <section className="space-y-3">
            <h3 className="text-[10px] text-[#4a6b7a] font-bold uppercase tracking-wider border-b border-[#1e3a4a]/20 pb-1">System Overview</h3>
            <div className="space-y-2.5">
              {specs.map((s) => (
                <div key={s.label} className="flex items-center gap-3">
                  <s.icon className="text-[#34d399]/70" size={14} />
                  <div className="flex-1 flex justify-between items-baseline gap-2">
                    <span className="text-xs text-[#4a6b7a]">{s.label}</span>
                    <span className="text-xs text-white text-right font-medium">{s.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-[10px] text-[#4a6b7a] font-bold uppercase tracking-wider border-b border-[#1e3a4a]/20 pb-1">Kernel Modules</h3>
            <div className="grid grid-cols-2 gap-x-3 gap-y-2">
              {modules.map((m) => (
                <div key={m.name} className="flex items-center justify-between p-2 rounded bg-[#0d1117]/50 border border-[#1e3a4a]/20 group hover:border-[#34d399]/30 transition-colors">
                  <span className="text-[10px] text-[#a8c4d0]">{m.name}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#1e3a4a]/30 text-[#34d399] font-bold">{m.ver}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="px-6 py-4 bg-[#0d1117] border-t border-[#1e3a4a]/30 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
        <button
          onClick={handleUpdateCheck}
          disabled={isUpdating}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1e3a4a]/30 border border-[#1e3a4a]/50 text-[11px] text-white hover:bg-[#1e3a4a]/50 transition-all disabled:opacity-50"
        >
          {updateStatus === "checking" ? (
            <FiRefreshCw size={12} className="animate-spin text-[#34d399]" />
          ) : updateStatus === "latest" ? (
            <FiCheck size={12} className="text-[#34d399]" />
          ) : (
            <FiRefreshCw size={12} />
          )}
          {updateStatus === "checking" ? "Checking for updates..." : updateStatus === "latest" ? "System is up to date" : "Software Update..."}
        </button>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/kaptaincs3/portoflio"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[11px] text-[#4a6b7a] hover:text-white transition-colors group"
          >
            System Report
            <FiExternalLink size={10} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
          <span className="text-[11px] text-[#1e3a4a]">|</span>
          <span className="text-[11px] text-[#4a6b7a]">© 2026 KaptainCS3</span>
        </div>
      </div>
    </div>
  )
}
