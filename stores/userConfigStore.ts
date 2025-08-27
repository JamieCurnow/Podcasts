export const useUserConfigStore = defineStore(
  'userConfig',
  () => {
    const swipeDownBeforeCloseAmount = ref(150)
    const amountOfPodsToInitiallyFetch = ref(5)
    const playbackSpeed = ref(1)
    const pullDownWeight = ref(0.85) // Default value for pull down weight

    onMounted(() => {
      if (!amountOfPodsToInitiallyFetch.value) {
        amountOfPodsToInitiallyFetch.value = 5 // default value
      }
      if (!playbackSpeed.value) {
        playbackSpeed.value = 1 // default value
      }
      if (!swipeDownBeforeCloseAmount.value) {
        swipeDownBeforeCloseAmount.value = 150 // default value
      }
      if (!pullDownWeight.value) {
        pullDownWeight.value = 0.85 // default value
      }
    })

    return {
      swipeDownBeforeCloseAmount,
      amountOfPodsToInitiallyFetch,
      playbackSpeed,
      pullDownWeight
    }
  },
  {
    persist: {
      key: 'pod_persist_user_config',
      pick: ['swipeDownBeforeCloseAmount', 'amountOfPodsToInitiallyFetch', 'playbackSpeed', 'pullDownWeight']
    }
  }
)
