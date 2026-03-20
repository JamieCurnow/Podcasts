/**
 * Parse an OPML string and return a structured representation of its contents.
 * Handle version 1.0 and 2.0 formats.
 *
 * This is specifically for podcasts, so we will focus on the relevant fields.
 *
 * Returns an array of objects with the feed URL and name (from text/title attributes).
 */
export const parseOpml = (opmlString: string) => {
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(opmlString, 'text/xml')
  const outlines = xmlDoc.getElementsByTagName('outline')
  const feeds: { url: string; name: string }[] = []

  for (let i = 0; i < outlines.length; i++) {
    const outline = outlines[i]
    const xmlUrl = outline?.getAttribute('xmlUrl')
    if (xmlUrl) {
      const name = outline?.getAttribute('text') || outline?.getAttribute('title') || xmlUrl
      feeds.push({ url: xmlUrl, name })
    }
  }

  return feeds
}
