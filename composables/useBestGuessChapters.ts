import { bestGuessChaptersStrategies } from './chapterStrategies'
export const useBestGuessChapters = (description: string) => {
  if (!description) return []
  for (const strategy of bestGuessChaptersStrategies) {
    if (!strategy) continue
    if (typeof strategy !== 'function') continue

    const chapters = strategy(description)
    if (!chapters) continue
    // if chapters is not an array, skip
    if (!Array.isArray(chapters)) continue
    if (chapters.length > 0) return chapters
  }
  return []
}
