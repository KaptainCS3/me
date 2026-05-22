import { ImageResponse } from "next/og"

export const alt = "Mbi Enow Leonard Appelgryn — Software Engineer"
export const size = { width: 1200, height: 600 }
export const contentType = "image/png"

const AVATAR_URL = "https://avatars.githubusercontent.com/kaptaincs3"

export default async function TwitterImage() {
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
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 16,
        }}
      >
        <img
          src={AVATAR_URL}
          alt=""
          width={60}
          height={60}
          style={{
            borderRadius: 12,
            border: "2px solid rgba(52, 211, 153, 0.4)",
          }}
        />
      </div>
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
