import { NextResponse } from "next/server"

const ORIGIN = "https://globalbushtratour.com"
const PROXY_PREFIX = "/api/proxy/global-bush"

function rewriteHtml(html: string): string {
  // Rewrite relative paths in common attributes to go through our proxy.
  // This avoids CORS/CORB blocking when loading subresources cross-origin.
  // Exclude protocol-relative URLs (starting with //)
  let result = html.replace(
    /(href|src|action)(=(["']))\/(?!\/)/g,
    `$1$2${PROXY_PREFIX}/`,
  )
  // Handle srcset (comma-separated URLs with optional descriptors)
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
            pieces[0] = `${PROXY_PREFIX}${url}`
          }
          return pieces.join(" ")
        })
        .join(", ")
      return `srcset=${quote}${rewritten}${quote}`
    },
  )
  // Handle meta content attributes that are relative paths
  result = result.replace(
    /(content=(["']))\/(?!\/)/g,
    `$1${PROXY_PREFIX}/`,
  )
  return result
}

export async function GET() {
  try {
    const res = await fetch(ORIGIN, {
      next: { revalidate: 3600 },
    })
    const body = await res.text()
    const modified = rewriteHtml(body)

    return new NextResponse(modified, {
      headers: {
        "Content-Type": res.headers.get("Content-Type") || "text/html",
      },
    })
  } catch {
    return new NextResponse("Site unavailable", { status: 502 })
  }
}
