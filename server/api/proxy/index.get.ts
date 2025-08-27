import { defineEventHandler, getQuery, createError, sendStream } from 'h3'

export default defineEventHandler(async (event) => {
  const { url: proxyUrl, cacheMaxAge } = getQuery(event)

  if (!proxyUrl || typeof proxyUrl !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request: url query parameter is required' })
  }

  // The original proxy has Cloudflare-specific image optimization (resizing).
  // This cannot be replicated 1:1 in a standard Nitro environment.
  // We can, however, replicate the caching logic for images.
  const isImgRegex = /\.(png|jpe?g|gif|webp|bmp|ico|svg|tiff?|eps)$/i
  const isImg = isImgRegex.test(proxyUrl)

  let res = await fetch(proxyUrl, {
    headers: {
      // Pass through some headers from the original request to appear more like a browser
      Accept: event.node.req.headers.accept || '*/*',
      'User-Agent': event.node.req.headers['user-agent'] || 'Hark-Proxy/1.0'
    }
  })

  // Follow redirects, up to 10 times
  let redirectCount = 0
  while (res.status >= 300 && res.status < 400 && res.headers.get('Location') && redirectCount < 10) {
    const location = res.headers.get('Location')
    if (!location) break
    res = await fetch(location)
    redirectCount++
  }

  // Set CORS headers
  const corsDomains = ['http://localhost:3000', 'https://lovepodcasts.com']
  const origin = event.node.req.headers.origin
  if (origin && corsDomains.includes(origin)) event.node.res.setHeader('Access-Control-Allow-Origin', origin)

  // Set Cache-Control headers
  if (cacheMaxAge) {
    const cacheControl = `public, max-age=${cacheMaxAge}`
    event.node.res.setHeader('Cache-Control', cacheControl)
  } else if (isImg) {
    // Replicate the 30-day cache for images from the original worker
    const cacheControl = `public, max-age=${60 * 60 * 24 * 30}`
    event.node.res.setHeader('Cache-Control', cacheControl)
  }

  // Set content type from the fetched resource
  const contentType = res.headers.get('Content-Type')
  if (contentType) event.node.res.setHeader('Content-Type', contentType)

  // Stream the response body
  if (res.body) return sendStream(event, res.body)

  return ''
})
