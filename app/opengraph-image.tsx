import { ImageResponse } from "next/og"

export const alt = "Mbi Enow Leonard Appelgryn — Software Engineer Portfolio"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const AVATAR_URL = "https://avatars.githubusercontent.com/kaptaincs3"

export default async function OgImage() {
  let avatarDataUri = ""
  try {
    const res = await fetch(AVATAR_URL)
    const buf = await res.arrayBuffer()
    const base64 = Buffer.from(buf).toString("base64")
    avatarDataUri = `data:image/png;base64,${base64}`
  } catch {}

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
          gap: 20,
          marginBottom: 20,
        }}
      >
        {avatarDataUri && (
          <img
            src={avatarDataUri}
            alt=""
            width={72}
            height={72}
            style={{
              borderRadius: 16,
              border: "2px solid rgba(52, 211, 153, 0.4)",
            }}
          />
        )}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 20,
            background: "rgba(52, 211, 153, 0.1)",
            border: "1px solid rgba(52, 211, 153, 0.3)",
            fontSize: 40,
            fontWeight: 700,
            color: "#34d399",
            display: avatarDataUri ? "none" : "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          K
        </div>
      </div>
      <div
        style={{
          fontSize: 52,
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
          fontSize: 24,
          color: "#34d399",
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        Software Engineer
      </div>
      <div
        style={{
          marginTop: 32,
          display: "flex",
          gap: 24,
          fontSize: 16,
          color: "#6b8fa0",
        }}
      >
        <span>Next.js</span>
        <span>React</span>
        <span>TypeScript</span>
        <span>Cloud</span>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 4,
          background: "linear-gradient(90deg, transparent, #34d399, transparent)",
        }}
      />
    </div>,
    { ...size },
  )
}
