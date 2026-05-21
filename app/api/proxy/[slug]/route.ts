import { NextResponse } from "next/server"
import { getUpstreamUrl, getProxyPrefix } from "@/data/proxyConfig"

function rewriteHtml(html: string, prefix: string): string {
  let result = html.replace(
    /(href|src|action)(=(["']))\/(?!\/)/g,
    `$1$2${prefix}/`,
  )
  result = result.replace(
    /srcset=(["'])([^"']+)\1/g,
    (match, quote, value) => {
      const rewritten = value
        .split(",")
        .map((part: string) => {
          const trimmed = part.trim()
          const pieces = trimmed.split(/\s+/)
          const url = pieces[0]
          if (url.startsWith("/")) {
            pieces[0] = `${prefix}${url}`
          }
          return pieces.join(" ")
        })
        .join(", ")
      return `srcset=${quote}${rewritten}${quote}`
    },
  )
  result = result.replace(
    /(content=(["']))\/(?!\/)/g,
    `$1${prefix}/`,
  )
  return result
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  const origin = getUpstreamUrl(slug)
  if (!origin) {
    return new NextResponse("Unknown proxy target", { status: 404 })
  }

  try {
    const res = await fetch(origin, {
      next: { revalidate: 3600 },
    })
    const body = await res.text()
    const prefix = getProxyPrefix(slug)
    const modified = rewriteHtml(body, prefix)

    return new NextResponse(modified, {
      headers: {
        "Content-Type": res.headers.get("Content-Type") || "text/html",
      },
    })
  } catch {
    return new NextResponse("Site unavailable", { status: 502 })
  }
}
