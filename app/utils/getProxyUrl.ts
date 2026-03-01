export const getProxyUrl = (opts: { url: string; cacheMaxAgeSeconds?: number }) => {
  const { url, cacheMaxAgeSeconds } = opts
  let proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}`
  if (cacheMaxAgeSeconds) {
    proxyUrl += `&cacheMaxAge=${cacheMaxAgeSeconds}`
  }
  return proxyUrl
}
