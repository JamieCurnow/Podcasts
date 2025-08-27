import type { EpisodeMeta } from '~/types/EpisodeMeta'

export const useSubsStore = defineStore(
  'subs',
  () => {
    const urls = ref<string[] | undefined>(undefined)

    const showManageSubs = ref(false)
    const lastPersisted = ref<number | undefined>(undefined)
    onMounted(() => {
      lastPersisted.value = new Date().getTime()
    })

    const episodes = ref<EpisodeMeta[] | undefined>(undefined)
    const updateEpisodeMeta = (meta: Pick<EpisodeMeta, 'feedUrl' | 'guid' | 'currentTime' | 'duration'>) => {
      if (!episodes.value) episodes.value = []

      const { currentTime, duration, feedUrl, guid } = meta
      // we'll say it's finished if the user is at least 95% through the pod
      const currentTimePercentage = (currentTime / duration) * 100
      const finished = currentTimePercentage >= 99

      const fullMeta: EpisodeMeta = {
        feedUrl,
        guid,
        currentTime,
        duration,
        finished,
        lastListenedAt: new Date().getTime(),
        started: true,
        startedAt: new Date().getTime()
      }

      // if the episode is already in the list, update it
      const idx = episodes.value.findIndex((e) => e.guid === meta.guid && e.feedUrl === meta.feedUrl)
      if (idx !== -1) {
        episodes.value?.splice(idx, 1, {
          ...fullMeta,
          startedAt: episodes.value[idx].startedAt || fullMeta.startedAt
        })
      } else {
        episodes.value?.push(fullMeta)
      }
    }

    const getEpisodeMeta = (opts: { feedUrl: string; guid: string }) => {
      return computed(() => {
        return episodes.value?.find((e) => e.feedUrl === opts.feedUrl && e.guid === opts.guid)
      })
    }

    const addSubscription = (url: string) => {
      if (!urls.value) {
        urls.value = []
      }
      if (!urls.value.includes(url)) {
        urls.value.push(url)
      }
    }

    onMounted(() => {
      if (!urls.value) {
        addSubscription('https://lexfridman.com/feed/podcast/')
      }
    })

    return {
      urls,
      showManageSubs,
      lastPersisted,
      episodes,
      updateEpisodeMeta,
      getEpisodeMeta,
      addSubscription
    }
  },
  { persist: { key: 'pod_persist_subs', pick: ['urls', 'lastPersisted', 'episodes'] } }
)
