"use client"

import { Mail, Briefcase, ExternalLink, MessageCircle } from "lucide-react"

const CONTACTS = [
  { icon: Mail, label: "Email", value: "mbiapplegryn@gmail.com", color: "#60a5fa" },
  { icon: Briefcase, label: "LinkedIn", value: "linkedin.com/in/leonard-appelgryn", color: "#34d399" },
  { icon: ExternalLink, label: "GitHub", value: "github.com/kaptaincs3", color: "#c084fc" },
  { icon: MessageCircle, label: "Twitter", value: "@KaptainCS3", color: "#1da1f2" },
]

export function ContactContent() {
  return (
    <div className="p-6 h-full flex flex-col font-mono overflow-y-auto">
      <p className="text-xs mb-4 text-[#4a6b7a] shrink-0">// Let&apos;s build something</p>
      <div className="space-y-3">
        {CONTACTS.map((c) => (
          <div
            key={c.label}
            className="flex items-center gap-3 p-3 rounded-lg bg-[#060d14] border border-[#1e3a4a]/50"
          >
            <c.icon size={18} style={{ color: c.color }} />
            <div>
              <p className="text-xs text-[#4a6b7a]">{c.label}</p>
              <p className="text-sm" style={{ color: c.color }}>
                {c.value}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 p-3 rounded-lg text-center text-xs text-[#34d399] bg-[#0a3d2b]/20 border border-[#1a6b4a]/50 shrink-0">
        🟢 Available for freelance · EN/FR · Remote
      </div>
    </div>
  )
}
