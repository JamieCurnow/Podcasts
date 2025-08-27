import type { Episode, Podcast } from '~/types/index'

export interface Bookmark {
  podcast: Podcast
  episode: Episode
  timestamp: number
  notes?: string
}

export const useBookmarksStore = defineStore(
  'bookmarks',
  () => {
    const bookmarks = ref<Bookmark[]>([])

    const addBookmark = (bookmark: Bookmark) => {
      bookmarks.value.unshift(bookmark)
    }

    const removeBookmark = (bookmark: Bookmark) => {
      bookmarks.value = bookmarks.value.filter(
        (b) => !(b.episode.guid === bookmark.episode.guid && b.timestamp === bookmark.timestamp)
      )
    }

    const isBookmarked = (episodeGuid: string, timestamp: number) => {
      return bookmarks.value.some((b) => b.episode.guid === episodeGuid && b.timestamp === timestamp)
    }

    return { bookmarks, addBookmark, removeBookmark, isBookmarked }
  },
  {
    persist: {
      key: 'pod_persist_bookmarks'
    }
  }
)
