<template>
  <div class="flex flex-col gap-6 pt-4 pb-40 px-4">
    <div>
      <div class="text-2xl font-bold">Stats for Nerds 🤓</div>
      <ClientOnly>
        <div v-if="trackingSince" class="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
          Listening time tracked since {{ trackingSinceFormatted }}
        </div>
      </ClientOnly>
    </div>

    <ClientOnly>
      <template v-if="!hasAnyData">
        <div class="text-center py-12 text-neutral-500 dark:text-neutral-400">
          <div class="text-4xl mb-4">📊</div>
          <div class="text-lg font-medium mb-2">No stats yet!</div>
          <div class="text-sm">Start listening to some podcasts and your stats will appear here.</div>
        </div>
      </template>

      <template v-else>
        <!-- Headline Stats -->
        <div class="grid grid-cols-2 gap-3">
          <div class="bg-neutral-100 dark:bg-neutral-800 rounded-xl p-4 text-center">
            <div class="text-3xl font-bold text-primary">{{ totalListeningTimeFormatted }}</div>
            <div class="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Total Listening Time</div>
          </div>
          <div class="bg-neutral-100 dark:bg-neutral-800 rounded-xl p-4 text-center">
            <div class="text-3xl font-bold text-primary">{{ episodesStarted }}</div>
            <div class="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Episodes Started</div>
          </div>
          <div class="bg-neutral-100 dark:bg-neutral-800 rounded-xl p-4 text-center">
            <div class="text-3xl font-bold text-primary">{{ episodesCompleted }}</div>
            <div class="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Episodes Completed</div>
          </div>
          <div class="bg-neutral-100 dark:bg-neutral-800 rounded-xl p-4 text-center">
            <div class="text-3xl font-bold text-primary">{{ podcastsSubscribed }}</div>
            <div class="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Podcasts Subscribed</div>
          </div>
        </div>

        <Divider />

        <!-- Fun Stats -->
        <div class="flex flex-col gap-2">
          <div class="text-lg font-semibold">Fun Stats</div>
          <div class="flex flex-col gap-3">
            <StatRow label="Completion Rate" :value="`${completionRate}%`" />
            <StatRow label="Average Episode Length" :value="averageEpisodeLengthFormatted" />
            <StatRow v-if="currentStreak > 0" label="Current Streak" :value="`${currentStreak} day${currentStreak !== 1 ? 's' : ''} 🔥`" />
            <StatRow label="Longest Streak" :value="`${longestStreak} day${longestStreak !== 1 ? 's' : ''}`" />
            <StatRow v-if="timeSavedAtSpeedSeconds > 0" label="Time Saved at Speed" :value="timeSavedFormatted" />
            <StatRow label="Bookmarks" :value="String(bookmarkCount)" />
            <StatRow label="Downloads" :value="String(completedDownloads)" />
            <StatRow label="Queue Size" :value="String(queueSize)" />
            <StatRow label="History" :value="`${historyCount} episodes`" />
          </div>
        </div>

        <!-- Top Podcasts -->
        <template v-if="topPodcasts.length">
          <Divider />
          <div class="flex flex-col gap-2">
            <div class="text-lg font-semibold">Most Listened Podcasts</div>
            <div class="flex flex-col gap-2">
              <div
                v-for="(pod, i) in topPodcasts"
                :key="pod.feedUrl"
                class="flex items-center gap-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg p-3"
              >
                <div class="text-lg font-bold text-neutral-400 w-6 text-center">{{ i + 1 }}</div>
                <div class="flex-1 min-w-0 truncate text-sm">{{ pod.feedUrl }}</div>
                <div class="text-sm font-medium text-primary shrink-0">
                  {{ pod.count }} ep{{ pod.count !== 1 ? 's' : '' }}
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- Listening Patterns -->
        <Divider />
        <div class="flex flex-col gap-2">
          <div class="text-lg font-semibold">Listening Patterns</div>

          <div v-if="mostActiveHour" class="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
            Peak listening hour: <span class="font-medium text-primary">{{ mostActiveHour }}</span>
          </div>

          <!-- Day of Week Chart -->
          <div class="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Episodes by day of week</div>
          <div class="flex items-end gap-1.5 h-24">
            <div
              v-for="(count, i) in listeningByDayOfWeek"
              :key="i"
              class="flex-1 flex flex-col items-center gap-1"
            >
              <div
                class="w-full bg-primary rounded-t transition-all"
                :style="{ height: barHeight(count) }"
              />
              <div class="text-[10px] text-neutral-500 dark:text-neutral-400">
                {{ dayOfWeekLabels[i] }}
              </div>
            </div>
          </div>
        </div>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
const statsStore = useStatsStore()
const { dayOfWeekLabels } = statsStore
const {
  hasAnyData,
  totalListeningTimeFormatted,
  episodesStarted,
  episodesCompleted,
  podcastsSubscribed,
  completionRate,
  averageEpisodeLengthFormatted,
  currentStreak,
  longestStreak,
  timeSavedAtSpeedSeconds,
  timeSavedFormatted,
  bookmarkCount,
  completedDownloads,
  queueSize,
  historyCount,
  topPodcasts,
  mostActiveHour,
  listeningByDayOfWeek,
  trackingSince
} = storeToRefs(statsStore)

const dayjs = useDayjs()
const trackingSinceFormatted = computed(() => {
  if (!trackingSince.value) return ''
  return dayjs(trackingSince.value).format('D MMM YYYY')
})

const barHeight = (count: number) => {
  const max = Math.max(...listeningByDayOfWeek.value, 1)
  const pct = (count / max) * 100
  return `${Math.max(pct, 4)}%`
}
</script>
