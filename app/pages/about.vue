<template>
  <div class="about-page">
    <!-- Nav -->
    <nav
      ref="navRef"
      class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      :class="scrolled ? 'bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl shadow-sm' : ''"
    >
      <div class="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <NuxtLink to="/about" class="flex items-center gap-2.5 group">
          <img :src="logoSrc" alt="Love Podcasts" class="h-7 -rotate-90" />
          <span class="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100"
            >Love Podcasts</span
          >
        </NuxtLink>
        <div class="flex items-center gap-3">
          <a
            :href="GITHUB_URL"
            target="_blank"
            rel="noopener"
            class="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900"
          >
            <UIcon name="i-mdi-github" class="size-4" />
            GitHub
          </a>
          <NuxtLink
            to="/"
            class="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:scale-[1.02] active:scale-[0.98] transition-all focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900"
          >
            Open App
          </NuxtLink>
        </div>
      </div>
    </nav>

    <!-- Hero -->
    <section class="relative pt-32 pb-20 md:pt-44 md:pb-32 px-6 overflow-hidden">
      <div class="max-w-4xl mx-auto">
        <div class="hero-content" :class="{ 'hero-visible': heroVisible }">
          <h1
            class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] text-neutral-900 dark:text-neutral-50 mb-6"
          >
            No account. No tracking.<br />
            <span class="text-neutral-400 dark:text-neutral-500">Just your podcasts.</span>
          </h1>

          <p class="text-lg md:text-xl text-neutral-500 dark:text-neutral-400 max-w-xl leading-relaxed mb-10">
            A free, open source podcast app that works on every device. Install it once, own it forever.
          </p>

          <div class="flex flex-col sm:flex-row gap-3 mb-8">
            <NuxtLink
              to="/"
              class="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-semibold rounded-xl bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:scale-[1.02] active:scale-[0.98] transition-all focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900"
            >
              Open App
              <UIcon name="i-heroicons-arrow-right-20-solid" class="size-4" />
            </NuxtLink>
            <a
              :href="GITHUB_URL"
              target="_blank"
              rel="noopener"
              class="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-semibold rounded-xl border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-500 hover:scale-[1.02] active:scale-[0.98] transition-all focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900"
            >
              <UIcon name="i-mdi-github" class="size-5" />
              View on GitHub
            </a>
          </div>

          <p class="text-sm text-neutral-400 dark:text-neutral-500 tracking-wide">
            Open source &middot; MIT licensed &middot; No server, no account, no bullshit
          </p>
        </div>

        <!-- App screenshots -->
        <div class="hero-screenshots mt-24 md:mt-32" :class="{ 'hero-screenshots-visible': heroVisible }">
          <div class="relative max-w-3xl mx-auto">
            <!-- Primary screenshot -->
            <div
              class="relative rounded-2xl overflow-hidden shadow-2xl shadow-neutral-900/10 dark:shadow-black/40 border border-neutral-200 dark:border-neutral-700/50 bg-neutral-200 dark:bg-neutral-800"
            >
              <div
                class="aspect-video flex items-center justify-center text-neutral-400 dark:text-neutral-600 text-sm"
              >
                <!-- Placeholder: replace with actual screenshot -->
                <div class="text-center">
                  <UIcon name="i-heroicons-photo" class="size-12 mb-2 opacity-40" />
                  <p>App screenshot — player view</p>
                </div>
              </div>
            </div>

            <!-- Secondary screenshot (offset) -->
            <div
              class="hidden md:block absolute -bottom-12 -right-12 w-72 rounded-xl overflow-hidden shadow-xl shadow-neutral-900/10 dark:shadow-black/30 border border-neutral-200 dark:border-neutral-700/50 bg-neutral-200 dark:bg-neutral-800 rotate-3"
            >
              <div
                class="aspect-9/16 flex items-center justify-center text-neutral-400 dark:text-neutral-600 text-xs"
              >
                <div class="text-center">
                  <UIcon name="i-heroicons-photo" class="size-8 mb-1 opacity-40" />
                  <p>Library view</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Feature Pillars -->
    <section class="py-20 md:py-28 px-6">
      <div class="max-w-5xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div
            v-for="(pillar, i) in pillars"
            :key="pillar.title"
            v-animate
            class="rounded-2xl p-8 border border-neutral-200/60 dark:border-white/6 bg-neutral-100/50 dark:bg-white/2 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
            :style="{ transitionDelay: `${i * 80}ms` }"
          >
            <span class="text-3xl mb-4 block" aria-hidden="true">{{ pillar.icon }}</span>
            <h3 class="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-2">
              {{ pillar.title }}
            </h3>
            <p class="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
              {{ pillar.copy }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Feature Grid -->
    <section class="py-20 md:py-28 px-6">
      <div class="max-w-5xl mx-auto">
        <h2
          v-animate
          class="text-2xl md:text-3xl font-bold text-center text-neutral-900 dark:text-neutral-100 mb-16"
        >
          Everything you need. Nothing you don't.
        </h2>

        <div class="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-10">
          <div
            v-for="(feature, i) in features"
            :key="feature.label"
            v-animate
            :style="{ transitionDelay: `${i * 60}ms` }"
          >
            <span class="text-2xl mb-3 block" aria-hidden="true">{{ feature.icon }}</span>
            <p class="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
              {{ feature.label }}
            </p>
            <p class="text-sm text-neutral-500 dark:text-neutral-400">{{ feature.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Who Is This For -->
    <section class="py-20 md:py-28 px-6 bg-neutral-100 dark:bg-neutral-800/60">
      <div class="max-w-2xl mx-auto text-center">
        <h2 v-animate class="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-8">
          Built for people who actually care about this stuff.
        </h2>

        <div v-animate class="space-y-5 text-neutral-600 dark:text-neutral-400 leading-relaxed">
          <p>
            If you're tired of podcast apps that require an account just to listen, track your every move, and
            lock your library behind a subscription — this is for you.
          </p>
          <p>
            Love Podcasts is RSS-native. That means you add podcasts via their RSS feed, not a search box.
            It's a small trade-off that keeps everything open, private, and yours.
          </p>
          <p class="text-neutral-500 dark:text-neutral-500">If that sounds like your kind of app, welcome.</p>
        </div>
      </div>
    </section>

    <!-- Open Source Callout -->
    <section class="py-20 md:py-28 px-6">
      <div
        v-animate
        class="max-w-3xl mx-auto rounded-2xl px-8 py-12 md:px-14 md:py-16 text-center bg-neutral-900 dark:bg-neutral-800 border border-neutral-800 dark:border-neutral-700"
      >
        <h2 class="text-2xl md:text-3xl font-bold text-white mb-5">Fully open source</h2>
        <p class="text-neutral-400 leading-relaxed max-w-lg mx-auto mb-8">
          Built in the open. MIT licensed. If you find a bug, fix it. If you want a feature, build it. Or just
          take a look under the hood — there's nothing to hide.
        </p>
        <a
          :href="GITHUB_URL"
          target="_blank"
          rel="noopener"
          class="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl bg-white text-neutral-900 hover:bg-neutral-100 hover:scale-[1.02] active:scale-[0.98] transition-all focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900"
        >
          <UIcon name="i-mdi-github" class="size-4" />
          View on GitHub
        </a>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="py-24 md:py-32 px-6 text-center">
      <div v-animate class="max-w-xl mx-auto">
        <h2 class="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
          Ready to try it?
        </h2>
        <p class="text-neutral-500 dark:text-neutral-400 mb-8">
          No sign up. Open the app and start adding podcasts.
        </p>
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold rounded-xl bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:scale-[1.02] active:scale-[0.98] transition-all focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900"
        >
          Open App
          <UIcon name="i-heroicons-arrow-right-20-solid" class="size-4" />
        </NuxtLink>
        <p class="text-xs text-neutral-400 dark:text-neutral-500 mt-5">
          Works in any browser. Install as a PWA for the full experience.
        </p>
      </div>
    </section>

    <!-- Footer -->
    <footer class="py-8 px-6 border-t border-neutral-200/60 dark:border-neutral-800">
      <div
        class="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-1 text-sm text-neutral-400 dark:text-neutral-500"
      >
        <span>Love Podcasts</span>
        <span class="hidden sm:inline">&middot;</span>
        <span>Open source</span>
        <span class="hidden sm:inline">&middot;</span>
        <span>MIT</span>
        <span class="hidden sm:inline">&middot;</span>
        <a
          :href="GITHUB_URL"
          target="_blank"
          rel="noopener"
          class="text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900"
          >GitHub</a
        >
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'about' })

const GITHUB_URL = 'https://github.com/JamieCurnow/Podcasts'

const logoSrc = computed(() =>
  useColorMode().value === 'dark' ? '/logo-light-no-bg.svg' : '/logo-dark-no-bg.svg'
)

// Nav scroll state
const scrolled = ref(false)
const navRef = ref<HTMLElement | null>(null)

const handleScroll = () => {
  scrolled.value = window.scrollY > 20
}

// Hero entrance animation
const heroVisible = ref(false)

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  // Trigger hero animation after a brief delay for smooth entrance
  requestAnimationFrame(() => {
    heroVisible.value = true
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// Scroll-triggered fade-up directive
const vAnimate = {
  mounted(el: HTMLElement) {
    el.classList.add('animate-hidden')
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry?.isIntersecting) {
          el.classList.add('animate-visible')
          observer.unobserve(el)
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
  }
}

// Data
const pillars = [
  {
    icon: '\u{1F512}',
    title: 'Private by design',
    copy: 'No account required. No analytics. No data collection of any kind.'
  },
  {
    icon: '\u{1F4F1}',
    title: 'Every device, no app store',
    copy: 'Installs as a native-feeling app on iOS, Android, and desktop via PWA.'
  },
  {
    icon: '\u{1F513}',
    title: 'Fully open source',
    copy: 'MIT licensed. Inspect it, self-host it, contribute to it. Nothing hidden.'
  }
]

const features = [
  { icon: '\u26A1', label: 'Playback speed control', desc: '0.5x to 3x' },
  { icon: '\u{1F634}', label: 'Sleep timer', desc: "Falls asleep so you don't have to" },
  { icon: '\u{1F4D6}', label: 'Chapter support', desc: 'Native + parsed from descriptions' },
  { icon: '\u{1F4F6}', label: 'Offline ready', desc: 'Episodes cached for listening anywhere' },
  { icon: '\u{1F515}', label: 'Zero ads', desc: 'Not now, not ever' },
  { icon: '\u{1F4E1}', label: 'RSS powered', desc: 'Your podcasts, your feeds, no walled garden' }
]
</script>

<style scoped>
/* Scope link reset */
.about-page :deep(a) {
  text-decoration: none;
  font-weight: inherit;
}

/* Noise texture overlay */
.about-page {
  position: relative;
}

.about-page::before {
  content: '';
  position: fixed;
  inset: 0;
  opacity: 0.015;
  pointer-events: none;
  z-index: 100;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 256px 256px;
}

/* Hero entrance animations */
.hero-content {
  opacity: 0;
  transform: translateY(24px);
  transition:
    opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.hero-visible {
  opacity: 1;
  transform: translateY(0);
}

.hero-screenshots {
  opacity: 0;
  transform: translateY(32px);
  transition:
    opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.2s,
    transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.2s;
}

.hero-screenshots-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Scroll-triggered fade-up */
.animate-hidden {
  opacity: 0;
  transform: translateY(20px) scale(0.98);
  transition:
    opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.animate-visible {
  opacity: 1;
  transform: translateY(0) scale(1);
}
</style>
