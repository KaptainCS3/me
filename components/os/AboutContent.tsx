"use client"

import { FiUser, FiChevronRight } from "react-icons/fi"
import { RESUME } from "@/data/about"

export function AboutContent() {
  return (
    <div className="p-6 h-full overflow-auto font-mono space-y-5">
      <div className="flex items-start gap-5 mb-2">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0"
          style={{ background: "linear-gradient(135deg, #0a3d2b, #1a6b4a)" }}
        >
          <FiUser />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white mb-1">{RESUME.name}</h2>
          <p className="text-sm text-[#34d399]">{RESUME.title}</p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-4 italic text-sm text-slate-300">
        "target the peak | stay humble and cool | in mind 0100"
      </div>

      <div className="text-sm text-slate-400 leading-relaxed px-1">
        I am a Software Engineer based in Buea, Cameroon, with a passion for building high-scale, secure, and performant web applications. 
        My expertise lies in the **Next.js** and **TypeScript** ecosystem, where I've architected complex systems ranging from **Programmatic SEO (pSEO)** engines 
        to unified fintech payment integrations. I pride myself on writing clean, maintainable code and staying at the bleeding edge of web technology.
      </div>

      <div className="flex flex-wrap gap-4 text-xs">
        <div>
          <p className="text-[#4a6b7a] mb-1">Languages</p>
          <div className="flex flex-wrap gap-1">
            {RESUME.languages.map((l) => (
              <span key={l} className="px-2 py-0.5 rounded bg-[#0d1f16] text-[#a8c4d0] border border-[#1e3a2a]/50">
                {l}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[#4a6b7a] mb-1">Tools & Frameworks</p>
          <div className="flex flex-wrap gap-1">
            {RESUME.tools.map((t) => (
              <span key={t} className="px-2 py-0.5 rounded bg-[#0d1f16] text-[#a8c4d0] border border-[#1e3a2a]/50">
                {t}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[#4a6b7a] mb-1">Version Control</p>
          <div className="flex flex-wrap gap-1">
            {RESUME.versionControl.map((v) => (
              <span key={v} className="px-2 py-0.5 rounded bg-[#0d1f16] text-[#a8c4d0] border border-[#1e3a2a]/50">
                {v}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[#4a6b7a] mb-1">Currently Learning</p>
          <div className="flex flex-wrap gap-1">
            {RESUME.currentlyLearning.map((l) => (
              <span key={l} className="px-2 py-0.5 rounded bg-[#0d1f16] text-[#fb923c] border border-[#1e3a2a]/50">
                {l}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[#4a6b7a] mb-1">Project Management</p>
          <div className="flex flex-wrap gap-1">
            {RESUME.projectManagement.map((p) => (
              <span key={p} className="px-2 py-0.5 rounded bg-[#0d1f16] text-[#a8c4d0] border border-[#1e3a2a]/50">
                {p}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[#4a6b7a] mb-1">Communication</p>
          <div className="flex flex-wrap gap-1">
            {RESUME.communication.map((c) => (
              <span key={c} className="px-2 py-0.5 rounded bg-[#0d1f16] text-[#a8c4d0] border border-[#1e3a2a]/50">
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-[#1e3a4a]" />

      <div>
        <p className="text-xs text-[#34d399] mb-3">// work experience</p>
        <div className="space-y-4">
          {RESUME.experience.map((exp) => (
            <div key={exp.company + exp.period} className="border-l-2 border-[#1e3a4a] pl-3">
              <div className="flex items-baseline justify-between mb-1">
                <p className="text-sm font-semibold text-white">
                  {exp.role} @ <span className="text-[#60a5fa]">{exp.company}</span>
                </p>
                <p className="text-xs text-[#4a6b7a]">{exp.period}</p>
              </div>
              <p className="text-xs text-[#6b8fa0] mb-2">{exp.location}</p>
              <ul className="space-y-1">
                {exp.highlights.map((h) => (
                  <li key={h} className="text-xs text-[#a8c4d0] flex gap-2">
                    <span className="text-[#34d399] shrink-0"><FiChevronRight size={12} /></span>
                    {h}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-1 mt-2">
                {exp.tech.map((t) => (
                  <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-[#0d1f16] text-[#6b8fa0] border border-[#1e3a2a]/30">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-[#1e3a4a] pt-3">
        <p className="text-xs text-[#34d399] mb-2">// education</p>
        {RESUME.education.map((edu) => (
          <div key={edu.degree} className="text-sm text-[#a8c4d0]">
            <p>
              <span className="text-white">{edu.degree}</span> — {edu.institution}
            </p>
            <p className="text-xs text-[#6b8fa0]">{edu.location}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
