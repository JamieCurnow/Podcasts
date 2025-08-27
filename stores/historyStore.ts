import type { Episode, Podcast } from '~/types/index'

export const useHistoryStore = defineStore(
  'history',
  () => {
    const history = ref<{ podcast: Podcast; episode: Episode }[] | undefined>(undefined)

    const findEpisodeInHistory = (opts: { podcast: Podcast; episode: Episode }) => {
      if (!history.value) return { index: -1, item: undefined }

      const index = history.value.findIndex(
        (item) => item.podcast.feedUrl === opts.podcast.feedUrl && item.episode.guid === opts.episode.guid
      )

      return {
        index,
        item: history.value[index]
      }
    }

    const addToHistory = (opts: { podcast: Podcast; episode: Episode }) => {
      const { podcast, episode } = opts
      if (!history.value) history.value = []

      // if the podcast is already in the history, splice it out
      const { index } = findEpisodeInHistory({ podcast, episode })
      if (index !== -1) history.value.splice(index, 1)

      // add it to the front of the history
      history.value.unshift({ podcast, episode })
    }

    const removeFromHistory = (opts: { podcast: Podcast; episode: Episode }) => {
      const { podcast, episode } = opts
      if (!history.value) return

      const { index } = findEpisodeInHistory({ podcast, episode })

      if (index === -1) return

      history.value.splice(index, 1)
    }

    const clearAllHistory = () => {
      history.value = []
    }

    return { history, addToHistory, findEpisodeInHistory, removeFromHistory, clearAllHistory }
  },

  {
    persist: {
      key: 'pod_persist_history',
      pick: ['history']
    }
  }
)
