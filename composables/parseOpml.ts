/**
 * Parse an OPML string and return a structured representation of its contents.
 * Handle version 1.0 and 2.0 formats.
 *
 * This is specifically for podcasts, so we will focus on the relevant fields.
 *
 * We'd like to return an array of strings that are the URLs of the podcast RSS feeds.
 */
export const parseOpml = (opmlString: string) => {
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(opmlString, 'text/xml')
  const outlines = xmlDoc.getElementsByTagName('outline')
  const rssUrls: string[] = []

  for (let i = 0; i < outlines.length; i++) {
    const outline = outlines[i]
    const xmlUrl = outline.getAttribute('xmlUrl')
    if (xmlUrl) {
      rssUrls.push(xmlUrl)
    }
  }

  return rssUrls
}
