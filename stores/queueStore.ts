import type { Episode, Podcast } from '~/types/index'

export const useQueueStore = defineStore(
  'queueStore',
  () => {
    const queue = ref<{ podcast: Podcast; episode: Episode }[] | undefined>(undefined)

    const findEpisodeInQueue = (opts: { podcast: Podcast; episode: Episode }) => {
      if (!queue.value) return { index: -1, item: undefined }

      const index = queue.value.findIndex(
        (item) => item.podcast.feedUrl === opts.podcast.feedUrl && item.episode.guid === opts.episode.guid
      )

      return {
        index,
        item: queue.value[index]
      }
    }

    const addToQueue = (opts: { podcast: Podcast; episode: Episode }) => {
      const { podcast, episode } = opts
      if (!queue.value) queue.value = []

      // if the podcast is already in the queue, don't add it again
      if (findEpisodeInQueue({ podcast, episode }).index !== -1) return

      // otherwise, add it to the queue
      queue.value.push({ podcast, episode })
    }

    const removeFromQueue = (opts: { podcast: Podcast; episode: Episode }) => {
      const { podcast, episode } = opts
      if (!queue.value) return

      const { index } = findEpisodeInQueue({ podcast, episode })

      if (index === -1) return

      queue.value.splice(index, 1)
    }

    return { queue, addToQueue, removeFromQueue, findEpisodeInQueue }
  },
  {
    persist: {
      key: 'pod_persist_queue',
      pick: ['queue']
    }
  }
)
