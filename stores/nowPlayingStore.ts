import type { Episode, Podcast } from '~/types/index'
import throttle from 'lodash.throttle'
import { getTimeLeftText } from '~/utils/getTimeLeftText'
import { useUserConfigStore } from '~/stores/userConfigStore'

export const useNowPlayingStore = defineStore(
  'nowPlaying',
  () => {
    const { updateEpisodeMeta } = useSubsStore()
    const userConfigStore = useUserConfigStore()
    const { playbackSpeed } = storeToRefs(userConfigStore)

    // global audio el on the layout
    const audio = ref<HTMLAudioElement | undefined>(undefined)
    const src = ref<string | undefined>(undefined)
    const episode = ref<Episode | undefined>(undefined)
    const podcast = ref<Podcast | undefined>(undefined)
    const isError = ref(false)
    const errorMessage = ref('')
    const audioState = ref<'playing' | 'paused' | 'idle' | 'loading'>('idle')
    const duration = ref(0)
    const playbackRate = ref(0)
    const currentTime = ref(0)

    const currentTimePercentage = computed(() => {
      if (!currentTime.value || !duration.value) return 0
      return (currentTime.value / duration.value) * 100
    })

    const timeLeft = computed(() => {
      const time = duration.value - currentTime.value
      return time > 0 ? time : 0
    })

    const timeLeftText = computed(() => {
      return getTimeLeftText(timeLeft.value)
    })

    /* The time left in hh:mm:ss format */
    const timeLeftFormatted = computed(() => {
      return formatTime(Math.floor(timeLeft.value))
    })

    const currentTimeFormatted = computed(() => {
      return formatTime(Math.floor(currentTime.value))
    })

    const showError = (message: string) => {
      errorMessage.value = message || 'Something went wrong. Please try again.'
      isError.value = true
    }

    const reset = () => {
      audioState.value = 'idle'
      isError.value = false
      errorMessage.value = ''
      src.value = undefined
      if (audio.value) audio.value.src = ''
      episode.value = undefined
      podcast.value = undefined
      duration.value = 0
      currentTime.value = 0
    }

    const loadPodcast = async (opts: {
      episode: Episode
      podcast: Podcast
      dontPlay?: boolean
      at?: number
    }) => {
      reset()
      episode.value = opts.episode
      podcast.value = opts.podcast
      const url = opts.episode.enclosure.url
      if (!url) return showError('No audio file found')
      if (!audio.value) return showError('No audio element found')

      audioState.value = 'loading'

      // see if we have it in indexedDB
      // if so, load it from there
      const type = `audio/${url.split('.').pop()}`
      const cachedAudio = await getBlobFromIndexedDB(url, type)
      if (cachedAudio) {
        const blobUrl = URL.createObjectURL(cachedAudio)
        src.value = url
        audio.value.src = blobUrl
      } else {
        src.value = url
        audio.value.src = url
      }

      if (!opts.dontPlay) {
        try {
          // load and play
          audio.value.load()
          await audio.value.play()
          // update metadata for lockscreen
          updateMetadata()
          // seek to a specific time if provided
          if (opts.at) seekTo(opts.at)
          // add to history
          console.log('addToHistory')

          useHistoryStore().addToHistory({ podcast: opts.podcast, episode: opts.episode })
        } catch (error) {
          console.error(error)
          showError('Failed to play audio')
        }
      } else {
        audioState.value = 'paused'
      }
    }

    const updateMetadata = () => {
      const ep = episode.value
      const pod = podcast.value
      if (!ep || !pod) return

      const title = ep.title || ep.itunesTitle
      const artist = pod.title || pod.itunesSummary
      const artwork = pod.image?.url || pod.itunesImage

      navigator.mediaSession.metadata = new MediaMetadata({
        title,
        artist,
        artwork: [{ src: artwork }]
      })

      // Media is loaded, set the duration.
      updatePositionState()
    }

    const updatePositionState = () => {
      const a = audio.value
      if (!a) return
      const { duration: d, playbackRate: p, currentTime: c } = a
      // make sure we have all the values
      if (!d || !p || !c) return
      // make sure none of those values are NaN
      if (isNaN(d) || isNaN(p) || isNaN(c)) return
      playbackRate.value = p
      currentTime.value = c
      // only update duration if it's changed
      if (d !== duration.value) duration.value = d

      navigator.mediaSession.setPositionState({
        duration: Math.round(d),
        playbackRate: p,
        position: Math.round(c)
      })

      const feedUrl = podcast.value?.feedUrl
      const episodeGuid = episode.value?.guid

      if (feedUrl && episodeGuid) {
        updateEpisodeMeta({
          feedUrl,
          guid: episodeGuid,
          currentTime: Math.round(c),
          duration: Math.round(d)
        })
      }
    }

    const updatePositionStateThrottled = throttle(updatePositionState, 1000)

    // onMounted, listen to navigator events from lockscreen for pause etc.
    const defaultSkipTimeForwards = 30
    const defaultSkipTimeBackwards = 10

    onMounted(() => {
      /* Seek Backward & Seek Forward */
      navigator.mediaSession.setActionHandler('seekbackward', (event) => {
        if (!audio.value) return
        const skipTime = event.seekOffset || defaultSkipTimeBackwards
        audio.value.currentTime = Math.max(audio.value.currentTime - skipTime, 0)
        updatePositionState()
      })

      navigator.mediaSession.setActionHandler('seekforward', (event) => {
        const skipTime = event.seekOffset || defaultSkipTimeForwards
        if (!audio.value) return
        audio.value.currentTime = Math.min(audio.value.currentTime + skipTime, audio.value.duration)
        updatePositionState()
      })

      /* Play & Pause */
      navigator.mediaSession.setActionHandler('play', async () => {
        if (!audio.value) return
        await audio.value.play()
      })

      navigator.mediaSession.setActionHandler('pause', () => {
        if (!audio.value) return
        audio.value.pause()
      })

      // stop
      try {
        navigator.mediaSession.setActionHandler('stop', () => {
          // TODO: Clear UI playback...
          if (!audio.value) return
          console.log('TODO: stop', audio.value.currentTime)
        })
      } catch (error) {
        console.error('Warning! The "stop" media session action is not supported.')
      }

      // seek to
      try {
        navigator.mediaSession.setActionHandler('seekto', function (event) {
          if (!audio.value) return
          if (!event.seekTime) return

          if (event.fastSeek && 'fastSeek' in audio) {
            audio.value.fastSeek(event.seekTime)
            return
          }
          audio.value.currentTime = event.seekTime
          updatePositionState()
        })
      } catch (error) {
        console.error('Warning! The "seekto" media session action is not supported.')
      }
    })

    // watch audio element and add some event listeners when it comes in
    watch(audio, (el) => {
      if (!el) return

      el.playbackRate = playbackSpeed.value

      el.addEventListener('play', function () {
        navigator.mediaSession.playbackState = 'playing'
        audioState.value = 'playing'
      })
      el.addEventListener('pause', function () {
        navigator.mediaSession.playbackState = 'paused'
        audioState.value = 'paused'
      })
      el.addEventListener('timeupdate', function () {
        updatePositionStateThrottled()
      })
      // listen for audio finish event
      el.addEventListener('ended', () => {
        navigator.mediaSession.playbackState = 'paused'
        audioState.value = 'paused'
        // if the currently playing episode is in the queue, remove it
        if (podcast.value && episode.value) {
          useQueueStore().removeFromQueue({ podcast: podcast.value, episode: episode.value })
          // if there's a next in the queue, play it
          const { queue } = storeToRefs(useQueueStore())
          const next = queue.value?.[0]
          if (!next) return
          loadPodcast({ episode: next.episode, podcast: next.podcast })
        }
      })
    })

    watch(playbackSpeed, (speed) => {
      if (audio.value) {
        audio.value.playbackRate = speed
      }
    })

    const play = () => {
      if (!audio.value) return
      audio.value.play()
      updateMetadata()
    }

    const pause = () => {
      if (!audio.value) return
      audio.value.pause()
    }

    const skipForwards = () => {
      if (!audio.value) return
      audio.value.currentTime += defaultSkipTimeForwards
    }

    const skipBackwards = () => {
      if (!audio.value) return
      audio.value.currentTime -= defaultSkipTimeBackwards
    }

    const seekTo = (time: number) => {
      if (!audio.value) return
      audio.value.currentTime = time
    }

    const currentPodcastDialogOpen = ref(false)

    // load onMounted
    onMounted(async () => {
      if (podcast.value && episode.value) {
        await until(audio).toBeTruthy()
        const ct = currentTime.value
        await loadPodcast({ episode: episode.value, podcast: podcast.value, dontPlay: true })
        if (ct) {
          setTimeout(() => {
            seekTo(ct)
          }, 500)
        }
      }
    })

    return {
      audio,
      src,
      // fns
      loadPodcast,
      play,
      pause,
      skipForwards,
      skipBackwards,
      seekTo,

      // state
      episode,
      podcast,
      isError,
      errorMessage,
      audioState,
      duration,
      playbackRate,
      currentTime,
      timeLeft,
      timeLeftText,
      currentTimePercentage,
      currentPodcastDialogOpen,
      timeLeftFormatted,
      currentTimeFormatted,
      formatTime
    }
  },
  {
    persist: {
      key: 'pod_persist_now_playing',
      pick: ['episode', 'podcast', 'currentTime']
    }
  }
)

export const formatTime = (time: number) => {
  if (!time) return '00:00'
  const hours = Math.floor(time / 3600)
  const minutes = Math.floor((time % 3600) / 60)
  const seconds = Math.floor(time % 60)
  const text = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  // trim any leading 0s and : chars. Eg. 00:00:01 => 1 and 01:01:01 => 1:01:01
  return text.replace(/^00:?/g, '')
}
