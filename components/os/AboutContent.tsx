"use client"

export function AboutContent() {
  return (
    <div className="p-6 h-full overflow-auto font-mono">
      <div className="flex items-start gap-5 mb-6">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0"
          style={{ background: "linear-gradient(135deg, #0a3d2b, #1a6b4a)" }}
        >
          🧑‍💻
        </div>
        <div>
          <h2 className="text-xl font-bold text-white mb-1">KaptainCS3</h2>
          <p className="text-sm text-[#34d399]">Full-stack Web Developer</p>
          <p className="text-xs mt-1 text-[#6b8fa0]">📍 Yaoundé, Cameroon</p>
        </div>
      </div>
      <div className="space-y-3 text-sm text-[#a8c4d0]">
        <p>
          I build <span className="text-[#34d399]">multilingual travel & tourism websites</span>{" "}
          for Central African clients — fast, SEO-optimized, and conversion-focused.
        </p>
        <p>
          Speciality:{" "}
          <span className="text-[#60a5fa]">EN/FR bilingual routing</span> with fully translated
          URL slugs, WhatsApp deeplinks as primary booking CTAs, and reusable component
          architectures built for AI coding agents.
        </p>
        <p>
          Currently accepting{" "}
          <span className="text-[#fb923c]">freelance engagements</span> — remote-first, bilingual,
          payment via Wise or Payoneer.
        </p>
        <div className="pt-3 border-t border-[#1e3a4a]">
          <p className="text-xs text-[#4a6b7a]"># languages</p>
          <p>🇬🇧 English (fluent) · 🇫🇷 French (fluent)</p>
        </div>
      </div>
    </div>
  )
}
