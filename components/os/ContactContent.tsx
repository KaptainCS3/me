"use client"

import { useState } from "react"
import { FiMail, FiLinkedin, FiGithub, FiSend } from "react-icons/fi"
import { RiTwitterXLine } from "react-icons/ri"
import { RESUME } from "@/data/about"

export function ContactContent() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [sent, setSent] = useState(false)

  const contacts = [
    { icon: FiMail, label: "Email", value: RESUME.email, href: `mailto:${RESUME.email}`, color: "#60a5fa" },
    { icon: FiLinkedin, label: "LinkedIn", value: RESUME.linkedin, href: `https://${RESUME.linkedin}`, color: "#34d399" },
    { icon: FiGithub, label: "GitHub", value: RESUME.github, href: `https://${RESUME.github}`, color: "#c084fc" },
    { icon: RiTwitterXLine, label: "X", value: "@KaptainCS3", href: "https://x.com/KaptainCS3", color: "#1da1f2" },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const body = `From: ${name}\nEmail: ${email}\n\n${message}`
    window.open(`mailto:${RESUME.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)
    setSent(true)
    setTimeout(() => setSent(false), 3000)
  }

  return (
    <div className="p-6 h-full flex flex-col font-mono overflow-y-auto">
      <p className="text-xs mb-4 text-[#4a6b7a] shrink-0">// Let&apos;s build something</p>

      {/* Desktop: two columns */}
      <div className="hidden sm:flex gap-4 flex-1 min-h-0">
        {/* Left: Social links */}
        <div className="space-y-3 w-56 shrink-0">
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
                <p className="text-sm" style={{ color: c.color }}>{c.value}</p>
              </div>
            </a>
          ))}
        </div>

        {/* Right: Contact form */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-3 min-w-0">
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 rounded-lg bg-[#060d14] border border-[#1e3a4a]/50 text-sm text-white placeholder:text-[#4a6b7a] outline-none focus:border-[#34d399]/50 transition-colors"
          />
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 rounded-lg bg-[#060d14] border border-[#1e3a4a]/50 text-sm text-white placeholder:text-[#4a6b7a] outline-none focus:border-[#34d399]/50 transition-colors"
          />
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            className="w-full px-3 py-2 rounded-lg bg-[#060d14] border border-[#1e3a4a]/50 text-sm text-white placeholder:text-[#4a6b7a] outline-none focus:border-[#34d399]/50 transition-colors"
          />
          <textarea
            placeholder="Your Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={4}
            className="w-full px-3 py-2 rounded-lg bg-[#060d14] border border-[#1e3a4a]/50 text-sm text-white placeholder:text-[#4a6b7a] outline-none focus:border-[#34d399]/50 transition-colors resize-none"
          />
          <button
            type="submit"
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#34d399] text-[#060d14] text-sm font-semibold hover:bg-[#2bbf83] transition-colors cursor-pointer"
          >
            <FiSend size={14} />
            {sent ? "Sent!" : "Send Message"}
          </button>
        </form>
      </div>

      {/* Mobile: simplified */}
      <div className="sm:hidden flex flex-col gap-4">
        <div className="flex justify-center gap-4">
          {contacts.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 rounded-xl bg-[#060d14] border border-[#1e3a4a]/50 flex items-center justify-center hover:bg-[#0a1520] transition-colors"
              title={c.label}
            >
              <c.icon size={18} style={{ color: c.color }} />
            </a>
          ))}
        </div>
        <a
          href={`mailto:${RESUME.email}`}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#34d399] text-[#060d14] text-sm font-semibold hover:bg-[#2bbf83] transition-colors"
        >
          <FiSend size={14} />
          Send Email
        </a>
      </div>

      <div className="mt-4 p-3 rounded-lg text-center text-xs text-[#34d399] bg-[#0a3d2b]/20 border border-[#1a6b4a]/50 shrink-0">
        <span className="w-2 h-2 rounded-full bg-green-400 inline-block mr-1.5" /> Available for freelance · EN/FR · Remote
      </div>
    </div>
  )
}
