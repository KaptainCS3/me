import { ImageResponse } from "next/og"

export const alt = "Mbi Enow Leonard Appelgryn — Software Engineer"
export const size = { width: 1200, height: 600 }
export const contentType = "image/png"

export default function TwitterImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#050a12",
        color: "#e2e8f0",
        fontFamily: "monospace",
      }}
    >
      <div
        style={{
          fontSize: 56,
          fontWeight: 700,
          color: "#ffffff",
          marginBottom: 12,
          letterSpacing: "-0.02em",
        }}
      >
        Leonard Appelgryn
      </div>
      <div
        style={{
          fontSize: 22,
          color: "#34d399",
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        @KaptainCS3 · Software Engineer
      </div>
    </div>,
    { ...size },
  )
}
