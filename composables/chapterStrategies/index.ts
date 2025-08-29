import type { PodcastChapterJsonChapter } from '~/types/PodcastChapterJson'
import { lexStyle } from './lexStyle'

export const bestGuessChaptersStrategies: Array<(description: string) => PodcastChapterJsonChapter[]> = [
  lexStyle
]
