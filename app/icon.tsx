import { ImageResponse } from "next/og"

export const size = { width: 32, height: 32 }
export const contentType = "image/png"

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#050a12",
        borderRadius: 6,
        fontSize: 20,
        fontWeight: 700,
        color: "#34d399",
        fontFamily: "monospace",
      }}
    >
      K
    </div>,
    { ...size },
  )
}
