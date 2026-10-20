// light/dark values match the html background (neutral-50 / neutral-900) so the status bar blends in
const themeColors = { light: '#fafafa', dark: '#171717' }

export default defineNuxtPlugin(() => {
  // iOS Safari only applies :active (our press feedback) when a touch listener exists
  document.addEventListener('touchstart', () => {}, { passive: true })

  // theme-color metas follow the OS scheme, but the app has its own dark toggle, so keep them in sync
  const colorMode = useColorMode()
  watch(
    () => colorMode.value,
    (mode) => {
      const color = mode === 'dark' ? themeColors.dark : themeColors.light
      document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute('content', color))
    },
    { immediate: true }
  )
})
