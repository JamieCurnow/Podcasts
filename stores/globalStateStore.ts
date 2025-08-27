export const useGlobalStateStore = defineStore('globalStateStore', () => {
  const bodyScrollLock = ref(false)
  return {
    bodyScrollLock
  }
})
