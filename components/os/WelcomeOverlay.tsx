interface WelcomeOverlayProps {
  visible: boolean
}

export function WelcomeOverlay({ visible }: WelcomeOverlayProps) {
  if (!visible) return null

  return (
    <div className="absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
      <p className="text-xs text-[#34d399]/40 tracking-[0.2em] uppercase mb-3 font-medium">
        System Operational
      </p>
      <h1 className="text-5xl font-bold text-white/10 tracking-tight mb-1">
        KaptainCS3
      </h1>
      <p className="text-[10px] text-white/5 uppercase tracking-[0.4em] mb-4">
        Leonard Appelgryn
      </p>
      <div className="h-px w-12 bg-[#34d399]/20 mx-auto mb-4" />
      <p className="text-xs text-[#34d399]/30 animate-pulse">
        Click an app in the dock to begin
      </p>
    </div>
  )
}
