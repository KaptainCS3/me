import { NextResponse } from "next/server"

export async function GET() {
  try {
    const res = await fetch("https://globalbushtratour.com", {
      next: { revalidate: 3600 },
    })
    const body = await res.text()
    return new NextResponse(body, {
      headers: {
        "Content-Type": res.headers.get("Content-Type") || "text/html",
      },
    })
  } catch {
    return new NextResponse("Site unavailable", { status: 502 })
  }
}
