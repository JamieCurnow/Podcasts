import type { PodcastChapterJsonChapter } from '~/types/PodcastChapterJson'

/**
 * Lex-style chapters.
 * Format:
 * (00:00) – Introduction
 * (9:02:19) – Cold War 2.0
 */
export const lexStyle = (description: string) => {
  console.log('Trying lexStyle chapter parsing', { description })
  const regex = /\(?(\d{1,2}:\d{2}(?::\d{2})?)\)?\s*[–-]\s*(.+)/g
  const chapters: PodcastChapterJsonChapter[] = []
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
  if (chapters.length > 0) {
    console.log('Parsed lexStyle chapters:', chapters)
    return chapters
  } else {
    return []
  }
}
