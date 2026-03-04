export interface PodcastChapterJsonChapter {
  title?: string
  number?: number
  url?: string
  endTime?: number
  startTime: number
  img?: string
}

export interface PodcastChapterJson {
  version: string
  chapters: PodcastChapterJsonChapter[]
}
