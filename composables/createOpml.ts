/**
 * Create an OPML string from a list of RSS feed URLs in the 2.0 format.
 * We will include basic metadata for each podcast if available.
 */
export const createOpml = async (rssUrls: string[]) => {
  const maybePodcastsMeta = await Promise.all(rssUrls.map((url) => getPodMeta(url)))
  const podcastsMeta = maybePodcastsMeta.filter(exists)

  const opmlHeader = `<?xml version="1.0" encoding="UTF-8"?>
<opml version="2.0">
  <head>
    <title>Podcast Subscriptions</title>
    <dateCreated>${new Date().toUTCString()}</dateCreated>
    <ownerName>Love Podcasts</ownerName>
  </head>
  <body>
`
  const opmlFooter = `  </body>
</opml>`

  const outlineEntries = podcastsMeta
    .map(({ title, description, image, feedUrl, itunesImage }) => {
      const attrs = [
        `type="rss"`,
        `text="${escapeXml(title)}"`,
        `title="${escapeXml(title)}"`,
        `xmlUrl="${escapeXml(feedUrl)}"`
      ]
      if (description) {
        attrs.push(`description="${escapeXml(description)}"`)
      }
      if (image || itunesImage) {
        attrs.push(`image="${escapeXml(image.url || itunesImage)}"`)
      }
      return `    <outline ${attrs.join(' ')} />`
    })
    .join('\n')

  return opmlHeader + outlineEntries + '\n' + opmlFooter
}

const getPodMeta = async (rssUrl: string) => {
  try {
    const { amountOfPodsToInitiallyFetch } = storeToRefs(useUserConfigStore())

    const response = await $fetch('/api/podcast/feed', {
      query: { url: rssUrl, limit: amountOfPodsToInitiallyFetch.value }
    })
    return response.podcast || null
  } catch (error) {
    console.error('Error fetching podcast metadata:', error)
    return null
  }
}

const exists = <T>(value: T | null | undefined): value is T => value !== null && value !== undefined

const escapeXml = (unsafe: string) => {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
