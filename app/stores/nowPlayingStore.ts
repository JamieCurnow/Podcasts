import type { Episode, Podcast } from '~~/shared/types/index'
import throttle from 'lodash.throttle'
import { getTimeLeftText } from '~/utils/getTimeLeftText'
import { formatTime } from '~/utils/formatTime'
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
      releaseKeepAlive()
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
      _prevTimeUpdatePos = null
      _recoveryAttempts = []
      clearTimeout(_stallTimer)
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

    // Keep the OS media widget's seek bar in sync. The OS extrapolates from the last position we
    // gave it, so this needs calling on every play/pause/seek/rate change, not just on timeupdate.
    const syncMediaPositionState = () => {
      const a = audio.value
      if (!a || !('setPositionState' in navigator.mediaSession)) return
      const { duration: d, playbackRate: p, currentTime: c } = a
      // live streams have an infinite duration and no seek bar
      if (!d || !Number.isFinite(d) || !p || isNaN(c)) return
      try {
        navigator.mediaSession.setPositionState({
          duration: d,
          playbackRate: p,
          position: Math.min(Math.max(c, 0), d)
        })
      } catch (error) {
        console.warn('setPositionState failed', error)
      }
    }

    // Track previous timeupdate position to calculate actual listening time
    let _prevTimeUpdatePos: number | null = null

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

      // Calculate actual listened time delta (ignore seeks)
      // A normal timeupdate delta at 1x speed over 1s throttle is ~1s.
      // Cap at 3s to account for playback speeds up to ~2x plus some tolerance.
      let listenedTimeDelta = 0
      if (_prevTimeUpdatePos !== null) {
        const delta = c - _prevTimeUpdatePos
        if (delta > 0 && delta <= 3) {
          listenedTimeDelta = delta
        }
      }
      _prevTimeUpdatePos = c

      syncMediaPositionState()

      const feedUrl = podcast.value?.feedUrl
      const episodeGuid = episode.value?.guid

      if (feedUrl && episodeGuid) {
        updateEpisodeMeta({
          feedUrl,
          guid: episodeGuid,
          currentTime: Math.round(c),
          duration: Math.round(d),
          listenedTimeDelta
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

      /* Next & Previous track: podcasts don't have tracks, so these skip like the player buttons.
         Headphone double/triple taps send these, which makes skipping adverts easy. */
      navigator.mediaSession.setActionHandler('nexttrack', () => skipForwards())
      navigator.mediaSession.setActionHandler('previoustrack', () => skipBackwards())

      /* Play & Pause */
      navigator.mediaSession.setActionHandler('play', () => play())

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
        console.error(error)
        console.warn('Warning! The "stop" media session action is not supported.')
      }

      // seek to
      try {
        navigator.mediaSession.setActionHandler('seekto', function (event) {
          if (!audio.value) return
          if (!event.seekTime) return

          if (event.fastSeek && 'fastSeek' in audio.value) {
            audio.value.fastSeek(event.seekTime)
            return
          }
          audio.value.currentTime = event.seekTime
          updatePositionState()
        })
      } catch (error) {
        console.error(error)
        console.warn('Warning! The "seekto" media session action is not supported.')
      }
    })

    // Some hosts drop the stream mid-episode (e.g. Changelog, behind op3 + Podscribe redirects).
    // The audio element then errors out or sits buffering forever, and play() can't revive it,
    // so reload the source and carry on from where we were.
    const stallTimeoutMs = 20_000
    const maxRecoveriesPerMinute = 3
    let _stallTimer: ReturnType<typeof setTimeout> | undefined
    let _recoveryAttempts: number[] = []

    const recoverPlayback = async (opts: { play: boolean }) => {
      const el = audio.value
      const currentSrc = el?.currentSrc
      if (!el || !currentSrc) return
      clearTimeout(_stallTimer)

      // give up if it keeps failing, so a dead link doesn't retry forever
      const now = Date.now()
      _recoveryAttempts = _recoveryAttempts.filter((t) => now - t < 60_000)
      if (_recoveryAttempts.length >= maxRecoveriesPerMinute) {
        el.pause()
        audioState.value = 'paused'
        useToast().add({
          color: 'error',
          title: 'Playback stopped',
          description: 'Lost connection to the audio. Press play to try again.',
          duration: 5000
        })
        return
      }
      _recoveryAttempts.push(now)

      const at = el.currentTime || currentTime.value
      el.src = currentSrc
      el.load()
      // before metadata loads this sets the start position, so it resumes in the right place
      el.currentTime = at
      if (!opts.play) return
      try {
        await el.play()
      } catch (error) {
        console.error(error)
      }
    }

    // Chrome keeps the OS media widget for a paused player until the page gets frozen in the
    // background (or the player errors). Timers can't prevent freezing (they stop too), but holding
    // a Web Lock is one of Chrome's "don't freeze this page" signals. So hold one while paused, for
    // up to an hour, so the widget sticks around like a native app's.
    const keepAliveMaxMs = 60 * 60 * 1000
    let _keepAlive: { release: () => void } | undefined

    const holdKeepAlive = () => {
      if (_keepAlive || !('locks' in navigator)) return
      let release = () => {}
      const released = new Promise<void>((resolve) => (release = resolve))
      const keepAlive = { release }
      _keepAlive = keepAlive
      const timer = setTimeout(release, keepAliveMaxMs)
      navigator.locks
        .request('pod_paused_keep_alive', () => released)
        .catch(console.error)
        .finally(() => {
          clearTimeout(timer)
          if (_keepAlive === keepAlive) _keepAlive = undefined
        })
    }

    const releaseKeepAlive = () => {
      _keepAlive?.release()
      _keepAlive = undefined
    }

    // watch audio element and add some event listeners when it comes in
    watch(audio, (el) => {
      if (!el) return

      el.playbackRate = playbackSpeed.value

      el.addEventListener('play', function () {
        navigator.mediaSession.playbackState = 'playing'
        audioState.value = 'playing'
        releaseKeepAlive()
      })
      el.addEventListener('pause', function () {
        navigator.mediaSession.playbackState = 'paused'
        audioState.value = 'paused'
        clearTimeout(_stallTimer)
        if (src.value) holdKeepAlive()
      })
      // the OS widget extrapolates its seek bar from the last position state, so refresh it
      // whenever playback jumps or changes speed
      for (const event of ['loadedmetadata', 'durationchange', 'play', 'pause', 'seeked', 'ratechange']) {
        el.addEventListener(event, syncMediaPositionState)
      }
      // streams can drop mid-episode, which leaves the element dead until it's reloaded
      el.addEventListener('error', () => {
        console.error('audio error', el.error)
        // only network/decode errors are worth retrying. A bad URL (or the src = '' in reset())
        // reports MEDIA_ERR_SRC_NOT_SUPPORTED and would just fail again.
        const code = el.error?.code
        if (code !== MediaError.MEDIA_ERR_NETWORK && code !== MediaError.MEDIA_ERR_DECODE) return
        // reload while paused too: Chrome drops the OS media widget for a player in an error state
        recoverPlayback({ play: !el.paused })
      })
      el.addEventListener('waiting', () => {
        clearTimeout(_stallTimer)
        _stallTimer = setTimeout(() => {
          if (el.paused || el.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) return
          console.warn('audio stalled, reloading')
          recoverPlayback({ play: true })
        }, stallTimeoutMs)
      })
      el.addEventListener('playing', () => clearTimeout(_stallTimer))
      el.addEventListener('timeupdate', function () {
        updatePositionStateThrottled()
        useSleepTimerStore().checkTimer()
      })
      // listen for audio finish event
      el.addEventListener('ended', () => {
        navigator.mediaSession.playbackState = 'paused'
        audioState.value = 'paused'

        // end-of-episode sleep timer: cancel and don't auto-advance
        const sleepTimer = useSleepTimerStore()
        if (sleepTimer.mode === 'endOfEpisode') {
          sleepTimer.cancel()
          return
        }

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
      // a dead stream can't be resumed with play(), it needs reloading
      if (audio.value.error) {
        _recoveryAttempts = []
        return recoverPlayback({ play: true })
      }
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
      currentTimeFormatted
    }
  },
  {
    persist: {
      key: 'pod_persist_now_playing',
      pick: ['episode', 'podcast', 'currentTime']
    }
  }
)
