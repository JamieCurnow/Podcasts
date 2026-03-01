import type { PodcastChapterJsonChapter } from '~~/shared/types/PodcastChapterJson'
import { lexStyle } from './lexStyle'

export const bestGuessChaptersStrategies: Array<(description: string) => PodcastChapterJsonChapter[]> = [
  lexStyle
]
