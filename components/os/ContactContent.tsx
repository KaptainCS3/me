"use client"

import { FiMail, FiLinkedin, FiGithub } from "react-icons/fi"
import { RiTwitterXLine } from "react-icons/ri";
import { RESUME } from "@/data/about"
import { useMemo } from "react"

export function ContactContent() {
  const contacts = useMemo(
    () => [
      {
        icon: FiMail,
        label: "Email",
        value: RESUME.email,
        href: `mailto:${RESUME.email}`,
        color: "#60a5fa",
      },
      {
        icon: FiLinkedin,
        label: "LinkedIn",
        value: RESUME.linkedin,
        href: `https://${RESUME.linkedin}`,
        color: "#34d399",
      },
      {
        icon: FiGithub,
        label: "GitHub",
        value: RESUME.github,
        href: `https://${RESUME.github}`,
        color: "#c084fc",
      },
      {
        icon: RiTwitterXLine,
        label: "X(formerly Twitter)",
        value: "@KaptainCS3",
        href: "https://x.com/KaptainCS3",
        color: "#1da1f2",
      },
    ],
    [],
  );

  return (
    <div className="p-6 h-full flex flex-col font-mono overflow-y-auto">
      <p className="text-xs mb-4 text-[#4a6b7a] shrink-0">// Let&apos;s build something</p>
      <div className="space-y-3">
        {contacts.map((c) => (
          <a
            key={c.label}
            href={c.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-lg bg-[#060d14] border border-[#1e3a4a]/50 hover:bg-[#0a1520] transition-colors"
          >
            <c.icon size={18} style={{ color: c.color }} />
            <div>
              <p className="text-xs text-[#4a6b7a]">{c.label}</p>
              <p className="text-sm" style={{ color: c.color }}>
                {c.value}
              </p>
            </div>
          </a>
        ))}
      </div>
      <div className="mt-4 p-3 rounded-lg text-center text-xs text-[#34d399] bg-[#0a3d2b]/20 border border-[#1a6b4a]/50 shrink-0">
        🟢 Available for freelance · EN/FR · Remote
      </div>
    </div>
  )
}
