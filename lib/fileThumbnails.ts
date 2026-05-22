"use client"

const THUMB_SIZE = 80

function canvasToThumb(canvas: HTMLCanvasElement): string {
  return canvas.toDataURL("image/webp", 0.7)
}

function imageThumbnail(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(reader.error)
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error("Failed to decode image"))
      img.onload = () => {
        const canvas = document.createElement("canvas")
        const scale = Math.min(THUMB_SIZE / img.width, THUMB_SIZE / img.height)
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvasToThumb(canvas))
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  })
}

function videoThumbnail(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const video = document.createElement("video")
    video.muted = true
    video.preload = "metadata"
    video.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Failed to load video")) }
    video.onloadeddata = () => {
      video.currentTime = Math.min(0.5, video.duration / 2 || 0.5)
    }
    video.onseeked = () => {
      const canvas = document.createElement("canvas")
      const scale = Math.min(THUMB_SIZE / video.videoWidth, THUMB_SIZE / video.videoHeight)
      canvas.width = Math.round(video.videoWidth * scale)
      canvas.height = Math.round(video.videoHeight * scale)
      canvas.getContext("2d")!.drawImage(video, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      resolve(canvasToThumb(canvas))
    }
    video.src = url
  })
}

function audioThumbnail(): string {
  const canvas = document.createElement("canvas")
  canvas.width = THUMB_SIZE
  canvas.height = THUMB_SIZE
  const ctx = canvas.getContext("2d")!
  ctx.fillStyle = "#1a1a2e"
  ctx.fillRect(0, 0, THUMB_SIZE, THUMB_SIZE)
  const bars = 6
  const gap = 2
  const barW = Math.floor((THUMB_SIZE - gap * (bars + 1)) / bars)
  for (let i = 0; i < bars; i++) {
    const h = 10 + Math.random() * 40
    const x = gap + i * (barW + gap)
    ctx.fillStyle = `hsl(${220 + i * 15}, 70%, 60%)`
    ctx.fillRect(x, THUMB_SIZE / 2 - h / 2, barW, h)
  }
  return canvasToThumb(canvas)
}

function pdfThumbnail(): string {
  const canvas = document.createElement("canvas")
  canvas.width = THUMB_SIZE
  canvas.height = THUMB_SIZE
  const ctx = canvas.getContext("2d")!
  ctx.fillStyle = "#1a1a2e"
  ctx.fillRect(0, 0, THUMB_SIZE, THUMB_SIZE)
  ctx.fillStyle = "#ef4444"
  ctx.beginPath()
  ctx.roundRect(8, 6, THUMB_SIZE - 16, THUMB_SIZE - 12, 4)
  ctx.fill()
  ctx.fillStyle = "#ffffff"
  ctx.font = "bold 28px system-ui, sans-serif"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText("PDF", THUMB_SIZE / 2, THUMB_SIZE / 2)
  return canvasToThumb(canvas)
}

function genericThumbnail(type: string): string {
  const canvas = document.createElement("canvas")
  canvas.width = THUMB_SIZE
  canvas.height = THUMB_SIZE
  const ctx = canvas.getContext("2d")!
  ctx.fillStyle = "#1a1a2e"
  ctx.fillRect(0, 0, THUMB_SIZE, THUMB_SIZE)
  ctx.fillStyle = "#3b82f6"
  ctx.beginPath()
  ctx.roundRect(12, 6, THUMB_SIZE - 24, THUMB_SIZE - 12, 4)
  ctx.fill()
  ctx.fillStyle = "#ffffff"
  ctx.font = "bold 11px system-ui, sans-serif"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  const label = type.split("/").pop()?.toUpperCase() || "FILE"
  ctx.fillText(label, THUMB_SIZE / 2, THUMB_SIZE / 2)
  return canvasToThumb(canvas)
}

export async function generateThumbnail(file: File): Promise<string> {
  try {
    if (file.type.startsWith("image/")) return await imageThumbnail(file)
    if (file.type.startsWith("video/")) return await videoThumbnail(file)
    if (file.type.startsWith("audio/")) return audioThumbnail()
    if (file.type === "application/pdf") return pdfThumbnail()
    return genericThumbnail(file.type)
  } catch {
    return genericThumbnail(file.type)
  }
}

export function fileTypeBadge(type: string): string {
  if (type.startsWith("image/")) return "IMG"
  if (type.startsWith("video/")) return "VID"
  if (type.startsWith("audio/")) return "AUD"
  if (type === "application/pdf") return "PDF"
  if (type.startsWith("text/")) return "DOC"
  return type.split("/").pop()?.toUpperCase() || "FILE"
}
