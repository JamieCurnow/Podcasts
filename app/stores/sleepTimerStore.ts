import { formatTime } from '~/utils/formatTime'

export const useSleepTimerStore = defineStore(
  'sleepTimer',
  () => {
    const endTimestamp = ref<number | null>(null)
    const mode = ref<'timed' | 'endOfEpisode' | null>(null)
    const selectedMinutes = ref<number | null>(null)
    const now = ref(Date.now())

    const isActive = computed(() => mode.value !== null)

    const remainingSeconds = computed(() => {
      if (!endTimestamp.value) return 0
      const remaining = Math.max(0, Math.ceil((endTimestamp.value - now.value) / 1000))
      return remaining
    })

    const remainingFormatted = computed(() => formatTime(remainingSeconds.value))

    const start = (opts: { minutes: number } | { endOfEpisode: true }) => {
      if ('endOfEpisode' in opts) {
        mode.value = 'endOfEpisode'
        endTimestamp.value = null
        selectedMinutes.value = null
      } else {
        mode.value = 'timed'
        selectedMinutes.value = opts.minutes
        endTimestamp.value = Date.now() + opts.minutes * 60 * 1000
      }
    }

    const cancel = () => {
      endTimestamp.value = null
      mode.value = null
      selectedMinutes.value = null
    }

    const checkTimer = () => {
      now.value = Date.now()
      if (mode.value === 'timed' && endTimestamp.value && Date.now() >= endTimestamp.value) {
        const { pause } = useNowPlayingStore()
        pause()
        cancel()
      }
    }

    return {
      endTimestamp,
      mode,
      selectedMinutes,
      now,
      isActive,
      remainingSeconds,
      remainingFormatted,
      start,
      cancel,
      checkTimer
    }
  },
  {
    persist: {
      key: 'pod_persist_sleep_timer',
      pick: ['endTimestamp', 'mode', 'selectedMinutes']
    }
  }
)
