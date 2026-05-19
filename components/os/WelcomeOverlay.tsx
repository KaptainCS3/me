interface WelcomeOverlayProps {
  visible: boolean
}

export function WelcomeOverlay({ visible }: WelcomeOverlayProps) {
  if (!visible) return null

  return (
    <div className="absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
      <p className="text-xs text-white/20 tracking-[0.15em] uppercase mb-2">
        Portfolio OS
      </p>
      <p className="text-3xl font-bold text-white/8 tracking-[-0.02em]">
        KaptainCS3
      </p>
      <p className="text-xs text-[#34d399]/25 mt-2">
        Click an app in the dock to get started
      </p>
    </div>
  )
}
