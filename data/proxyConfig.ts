export const PROXY_ROUTES: Record<string, string> = {
  "global-bush": "https://globalbushtratour.com",
}

export function getUpstreamUrl(slug: string): string | undefined {
  return PROXY_ROUTES[slug]
}

export function getProxyPrefix(slug: string): string {
  return `/api/proxy/${slug}`
}

export function isProxyUrl(url: string): boolean {
  return url.startsWith("/api/proxy/")
}

export function getActualUrl(proxyUrl: string): string | null {
  const slug = proxyUrl.replace("/api/proxy/", "").split("/")[0]
  return PROXY_ROUTES[slug] ?? null
}
