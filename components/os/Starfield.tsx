"use client"

import { useRef, useEffect } from "react"

interface Star {
  xPct: number
  yPct: number
  radius: number
  maxAlpha: number
  period: number
  phase: number
  hue: number
}

export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const stars: Star[] = []
    const STAR_COUNT = 300

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    for (let i = 0; i < STAR_COUNT; i++) {
      const r = Math.random()
      stars.push({
        xPct: Math.random(),
        yPct: Math.random(),
        radius: 0.3 + Math.random() * 2.2,
        maxAlpha: 0.2 + Math.random() * 0.8,
        period: 3 + Math.random() * 7,
        phase: Math.random() * Math.PI * 2,
        hue: r > 0.7 ? (r > 0.85 ? 270 : 210) : 0,
      })
    }

    let animId: number

    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const ms = time // time is DOMHighResTimeStamp in ms

      for (const star of stars) {
        const progress = ((ms / 1000 / star.period) + star.phase) % 1
        let factor: number
        if (progress < 0.3) {
          factor = progress / 0.3
        } else if (progress < 0.7) {
          factor = 1
        } else {
          factor = 1 - (progress - 0.7) / 0.3
        }

        const alpha = star.maxAlpha * factor
        const x = star.xPct * canvas.width
        const y = star.yPct * canvas.height

        if (star.hue === 0) {
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
        } else if (star.hue === 210) {
          ctx.fillStyle = `rgba(170, 204, 255, ${alpha})`
        } else {
          ctx.fillStyle = `rgba(204, 170, 255, ${alpha})`
        }

        ctx.beginPath()
        ctx.arc(x, y, star.radius, 0, Math.PI * 2)
        ctx.fill()
      }

      animId = requestAnimationFrame(animate)
    }

    animId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  )
}
