import { NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params
  const upstreamUrl = `https://globalbushtratour.com/${path.join("/")}${request.nextUrl.search}`

  try {
    const res = await fetch(upstreamUrl, {
      next: { revalidate: 3600 },
    })
    const body = await res.arrayBuffer()

    return new NextResponse(body, {
      headers: {
        "Content-Type": res.headers.get("Content-Type") || "application/octet-stream",
        "Cache-Control": "public, max-age=3600",
      },
    })
  } catch {
    return new NextResponse("Not found", { status: 404 })
  }
}
