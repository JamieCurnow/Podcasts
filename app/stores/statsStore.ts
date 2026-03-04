export const useStatsStore = defineStore('stats', () => {
  const subsStore = useSubsStore()
  const historyStore = useHistoryStore()
  const bookmarksStore = useBookmarksStore()
  const downloadsStore = useDownloadsStore()
  const queueStore = useQueueStore()
  const userConfigStore = useUserConfigStore()

  const { episodes, urls } = storeToRefs(subsStore)
  const { history } = storeToRefs(historyStore)
  const { bookmarks } = storeToRefs(bookmarksStore)
  const { downloads } = storeToRefs(downloadsStore)
  const { queue } = storeToRefs(queueStore)
  const { playbackSpeed } = storeToRefs(userConfigStore)

  // --- Headline stats ---

  const totalListeningTimeSeconds = computed(() => {
    if (!episodes.value) return 0
    return episodes.value.reduce((sum, ep) => sum + (ep.listenedTime || 0), 0)
  })

  const totalListeningTimeFormatted = computed(() => {
    const secs = totalListeningTimeSeconds.value
    const hours = Math.floor(secs / 3600)
    const days = Math.floor(hours / 24)
    if (days >= 1) return `${days}d ${hours % 24}h`
    if (hours >= 1) return `${hours}h ${Math.floor((secs % 3600) / 60)}m`
    return `${Math.floor(secs / 60)}m`
  })

  const episodesStarted = computed(() => {
    if (!episodes.value) return 0
    return episodes.value.filter((ep) => ep.started).length
  })

  const episodesCompleted = computed(() => {
    if (!episodes.value) return 0
    return episodes.value.filter((ep) => ep.finished).length
  })

  const podcastsSubscribed = computed(() => urls.value?.length ?? 0)

  // --- Fun stats ---

  const completionRate = computed(() => {
    if (!episodesStarted.value) return 0
    return Math.round((episodesCompleted.value / episodesStarted.value) * 100)
  })

  const averageEpisodeLength = computed(() => {
    if (!episodes.value) return 0
    const started = episodes.value.filter((ep) => ep.started && ep.duration > 0)
    if (!started.length) return 0
    const avg = started.reduce((sum, ep) => sum + ep.duration, 0) / started.length
    return Math.round(avg)
  })

  const averageEpisodeLengthFormatted = computed(() => {
    const secs = averageEpisodeLength.value
    if (!secs) return '0m'
    const hours = Math.floor(secs / 3600)
    const mins = Math.floor((secs % 3600) / 60)
    if (hours >= 1) return `${hours}h ${mins}m`
    return `${mins}m`
  })

  const timeSavedAtSpeedSeconds = computed(() => {
    const speed = playbackSpeed.value
    if (speed <= 1) return 0
    const total = totalListeningTimeSeconds.value
    return Math.round(total - total / speed)
  })

  const timeSavedFormatted = computed(() => {
    const secs = timeSavedAtSpeedSeconds.value
    if (!secs) return '0m'
    const hours = Math.floor(secs / 3600)
    const mins = Math.floor((secs % 3600) / 60)
    if (hours >= 1) return `${hours}h ${mins}m`
    return `${mins}m`
  })

  const bookmarkCount = computed(() => bookmarks.value?.length ?? 0)

  const completedDownloads = computed(() => {
    if (!downloads.value) return 0
    return downloads.value.filter((d) => d.status === 'completed').length
  })

  const queueSize = computed(() => queue.value?.length ?? 0)

  const historyCount = computed(() => history.value?.length ?? 0)

  // --- Top podcasts by episode count ---

  const topPodcasts = computed(() => {
    if (!episodes.value) return []
    const counts: Record<string, number> = {}
    for (const ep of episodes.value) {
      if (ep.started) {
        counts[ep.feedUrl] = (counts[ep.feedUrl] || 0) + 1
      }
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([feedUrl, count]) => ({ feedUrl, count }))
  })

  // --- Streaks ---

  const _listeningDays = computed(() => {
    if (!episodes.value) return new Set<string>()
    const days = new Set<string>()
    for (const ep of episodes.value) {
      if (ep.lastListenedAt) {
        const d = new Date(ep.lastListenedAt)
        days.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`)
      }
    }
    return days
  })

  const longestStreak = computed(() => {
    const days = _listeningDays.value
    if (!days.size) return 0
    const sorted = Array.from(days).sort()
    let max = 1
    let current = 1
    for (let i = 1; i < sorted.length; i++) {
      const prev = new Date(sorted[i - 1]!)
      const curr = new Date(sorted[i]!)
      const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)
      if (Math.round(diff) === 1) {
        current++
        max = Math.max(max, current)
      } else {
        current = 1
      }
    }
    return max
  })

  const currentStreak = computed(() => {
    const days = _listeningDays.value
    if (!days.size) return 0
    const today = new Date()
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

    // Check yesterday too (streak is still active if listened yesterday)
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`

    if (!days.has(todayStr) && !days.has(yesterdayStr)) return 0

    const sorted = Array.from(days).sort().reverse()
    const startFrom = days.has(todayStr) ? todayStr : yesterdayStr
    const startIdx = sorted.indexOf(startFrom)
    if (startIdx === -1) return 0

    let streak = 1
    for (let i = startIdx + 1; i < sorted.length; i++) {
      const prev = new Date(sorted[i - 1]!)
      const curr = new Date(sorted[i]!)
      const diff = (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24)
      if (Math.round(diff) === 1) {
        streak++
      } else {
        break
      }
    }
    return streak
  })

  // --- Listening patterns ---

  const listeningByDayOfWeek = computed(() => {
    const counts = [0, 0, 0, 0, 0, 0, 0] // Sun-Sat
    if (!episodes.value) return counts
    for (const ep of episodes.value) {
      if (ep.lastListenedAt) {
        const day = new Date(ep.lastListenedAt).getDay()
        counts[day]!++
      }
    }
    return counts
  })

  const dayOfWeekLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const mostActiveHour = computed(() => {
    const counts = new Array(24).fill(0) as number[]
    if (!episodes.value) return null
    let hasData = false
    for (const ep of episodes.value) {
      if (ep.lastListenedAt) {
        const hour = new Date(ep.lastListenedAt).getHours()
        counts[hour]!++
        hasData = true
      }
    }
    if (!hasData) return null
    const maxCount = Math.max(...counts)
    const peakHour = counts.indexOf(maxCount)
    const ampm = peakHour >= 12 ? 'PM' : 'AM'
    const h = peakHour % 12 || 12
    return `${h}${ampm}`
  })

  // --- Tracking start ---

  const trackingSince = ref<number | null>(null)

  onMounted(() => {
    if (!trackingSince.value) {
      trackingSince.value = Date.now()
    }
  })

  // --- Utility ---

  const hasAnyData = computed(() => {
    return (episodes.value?.length ?? 0) > 0 || (history.value?.length ?? 0) > 0
  })

  return {
    // Headline
    totalListeningTimeSeconds,
    totalListeningTimeFormatted,
    episodesStarted,
    episodesCompleted,
    podcastsSubscribed,
    // Fun
    completionRate,
    averageEpisodeLength,
    averageEpisodeLengthFormatted,
    timeSavedAtSpeedSeconds,
    timeSavedFormatted,
    bookmarkCount,
    completedDownloads,
    queueSize,
    historyCount,
    topPodcasts,
    longestStreak,
    currentStreak,
    // Patterns
    listeningByDayOfWeek,
    dayOfWeekLabels,
    mostActiveHour,
    // Tracking
    trackingSince,
    // Utility
    hasAnyData
  }
}, {
  persist: {
    key: 'pod_persist_stats',
    pick: ['trackingSince']
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStatsStore, import.meta.hot))
}
