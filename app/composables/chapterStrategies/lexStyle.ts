import type { PodcastChapterJsonChapter } from '~~/shared/types/PodcastChapterJson'

/**
 * Lex-style chapters.
 * Format:
 * (00:00) – Introduction
 * (9:02:19) – Cold War 2.0
 * 
 * OR:
 * \n(2:44:51) &#8211; How OpenClaw works<br />\n(2:56:09) &#8211; AI slop<br />
 */
export const lexStyle = (description: string) => {
  const chapters: PodcastChapterJsonChapter[] = []
  console.log('Trying lexStyle chapter parsing', { description })

  if (!description.includes('&#8211;')) {
    const regex = /\(?(\d{1,2}:\d{2}(?::\d{2})?)\)?\s*[–-]\s*(.+)/g
    let match
    while ((match = regex.exec(description)) !== null) {
      const timeParts = match[1].split(':').map(Number)
      let seconds = 0
      if (timeParts.length === 3) {
        seconds = timeParts[0] * 3600 + timeParts[1] * 60 + timeParts[2]
      } else if (timeParts.length === 2) {
        seconds = timeParts[0] * 60 + timeParts[1]
      }
      chapters.push({ startTime: seconds, title: match[2].trim() })
    }
  } else {
    // here's the html description version like:
    // \n(2:44:51) &#8211; How OpenClaw works<br />\n(2:56:09) &#8211; AI slop<br />
    const regex = /\((\d{1,2}:\d{2}(?::\d{2})?)\)\s*&#8211;\s*(.+?)(?:<br\s*\/?>|$)/g
    let match
    while ((match = regex.exec(description)) !== null) {
      const timeParts = match[1].split(':').map(Number)
      let seconds = 0
      if (timeParts.length === 3) {
        seconds = timeParts[0] * 3600 + timeParts[1] * 60 + timeParts[2]
      } else if (timeParts.length === 2) {
        seconds = timeParts[0] * 60 + timeParts[1]
      }
      chapters.push({ startTime: seconds, title: match[2].trim() })
    }
  }

  if (chapters.length > 0) {
      console.log('Parsed lexStyle chapters:', chapters)
      return chapters
    } else {
      return []
    }
}
