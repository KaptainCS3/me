"use client"

import dynamic from "next/dynamic"

const PortfolioOS = dynamic(() => import("@/components/os/PortfolioOS"), {
  ssr: false,
  loading: () => (
    <div className="h-screen w-screen bg-[#050a12] flex flex-col items-center justify-center gap-4">
      <div className="w-8 h-8 border-2 border-[#34d399]/30 border-t-[#34d399] rounded-full animate-spin" />
      <p className="font-mono text-[10px] text-[#4a6b7a] tracking-widest animate-pulse uppercase">
        Loading Portfolio OS...
      </p>
      <div className="flex gap-1.5 mt-2">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-[#34d399]/40 animate-bounce"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  ),
})

export default function Home() {
  return <PortfolioOS />
}
