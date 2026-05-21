import { NextRequest, NextResponse } from "next/server"
import { getUpstreamUrl } from "@/data/proxyConfig"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; path: string[] }> },
) {
  const { slug, path } = await params
  const origin = getUpstreamUrl(slug)
  if (!origin) {
    return new NextResponse("Unknown proxy target", { status: 404 })
  }

  const upstreamUrl = `${origin}/${path.join("/")}${request.nextUrl.search}`

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
