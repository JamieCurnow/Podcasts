import { pawIconLinks } from './app/utils/pwaIconLinks'

// stop 404 api responses from being cached (see https://firebase.google.com/docs/hosting/manage-cache)
const noCache = () => ({
  headers: { 'Cache-Control': 'private, no-cache, no-store, max-age=0, must-revalidate, s-maxage=0' }
})

// Used as the Workbox revision for additionalManifestEntries — changes on every build
// so prerendered pages are always re-fetched and re-cached when the SW updates.
const buildRevision = Date.now().toString()

const preRenderRoutes = [
  '/about',
  '/podcast',
  '/podcast/episode',
  '/add-podcast',
  '/bookmarks',
  '/downloads',
  '/history',
  '/',
  '/library',
  '/queue',
  '/settings',
  '/start'
]

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: false },
  ssr: true,

  nitro: {
    preset: 'cloudflare-module',
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
      wrangler: {
        name: 'podcasts-app',
        observability: {
          enabled: true,
          head_sampling_rate: 1,
          logs: { enabled: true, head_sampling_rate: 1, invocation_logs: true }
        }
      }
    }
  },

  modules: [
    '@nuxt/ui',
    '@vueuse/nuxt',
    'dayjs-nuxt',
    '@nuxt/fonts',
    '@vite-pwa/nuxt',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@nuxt/eslint'
  ],

  imports: { dirs: ['~/types'] },

  typescript: {
    tsConfig: {
      exclude: ['.firebase']
    }
  },

  icon: {
    clientBundle: {
      scan: true
    }
  },

  routeRules: {
    /**
     * Pre-render rules need to be absolute paths - no wildcards.
     * see: https://github.com/unjs/nitro/issues/1856
     */
    /** Pages */
    ...Object.fromEntries(preRenderRoutes.map((route) => [route, { prerender: true }])),
    /** API */
    // default no cache
    '/api/**': noCache(),
    '/api/podcast/feed': {
      // 1 hr client, 1 hr edge
      headers: { 'Cache-Control': `public, max-age=3600, s-maxage=3600, stale-while-revalidate=3600` }
    }
  },

  app: {
    head: {
      title: 'Podcasts',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        // description
        { id: 'description', name: 'description', content: 'For the love of pods' },
        // theme-color
        { name: 'theme-color', content: '#EBEBEB', media: '(prefers-color-scheme: light)' },
        { name: 'theme-color', content: '#171717', media: '(prefers-color-scheme: dark)' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'Podcasts' },
        { property: 'og:description', content: 'Listen on LovePodcasts.com — for the love of pods.' },
        { property: 'og:image', content: '/pwa-icons/manifest-icon-512.maskable.png' },
        // Twitter Card
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:title', content: 'Podcasts' },
        { name: 'twitter:description', content: 'Listen on LovePodcasts.com — for the love of pods.' },
        { name: 'twitter:image', content: '/pwa-icons/manifest-icon-512.maskable.png' }
      ],
      link: [...pawIconLinks]
    }
  },

  css: ['~/assets/css/main.css'],

  fonts: {
    provider: 'google',
    families: [
      {
        name: 'Noto Sans',
        provider: 'google',
        global: true,
        weights: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
      }
    ]
  },

  pwa: {
    includeAssets: ['favicon.ico', 'apple-touch-icon-180x180.png', 'maskable-icon-512x512.png'],
    manifest: {
      name: 'Podcasts',
      short_name: 'Podcasts',
      description: 'For the love of pods',
      lang: 'en',
      background_color: '#171717',
      theme_color: '#171717',
      start_url: '/',
      display: 'standalone',
      display_override: ['standalone'],
      icons: [
        {
          src: '/pwa-icons/manifest-icon-192.maskable.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: '/pwa-icons/manifest-icon-192.maskable.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'maskable'
        },
        {
          src: '/pwa-icons/manifest-icon-512.maskable.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: '/pwa-icons/manifest-icon-512.maskable.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable'
        }
      ],
      screenshots: [
        { sizes: '3492x1624', src: '/pwa-screenshots/wide.png', type: 'image/png', form_factor: 'wide' },
        { sizes: '702x1484', src: '/pwa-screenshots/narrow.png', type: 'image/png', form_factor: 'narrow' }
      ]
    },
    workbox: {
      // Without this, vite-plugin-pwa registers a NavigationRoute that serves
      // the precached `/` for every navigation request, which hijacks deep
      // links like /podcast/episode?url=...&episodeGuid=... back to the home
      // page. Runtime caching below still handles online/offline navigation.
      navigateFallback: null,
      // Precache all prerendered pages at SW install time so they're available
      // offline even before the user has visited them. buildRevision ensures
      // Workbox re-fetches them on every deployment.
      additionalManifestEntries: preRenderRoutes.map((route) => ({
        url: route,
        revision: buildRevision
      })),
      runtimeCaching: [
        {
          // Podcast feed API — NetworkFirst so fresh data is fetched when online
          // and the last-known feed is served from cache when offline.
          urlPattern: ({ url }: { url: URL }) => url.pathname.startsWith('/api/podcast/feed'),
          handler: 'NetworkFirst',
          options: {
            cacheName: 'podcast-feeds',
            networkTimeoutSeconds: 5,
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 24 * 60 * 60 // 24 hours
            },
            cacheableResponse: {
              statuses: [200]
            }
          }
        },
        {
          // Navigation requests (page loads) — NetworkFirst with 3s timeout:
          // tries the network, caches the response, falls back to cache when offline.
          // This means any page visited online will work offline on the next open.
          urlPattern: ({ request }: { request: Request }) => request.mode === 'navigate',
          handler: 'NetworkFirst',
          options: {
            cacheName: 'pages',
            networkTimeoutSeconds: 3,
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 7 * 24 * 60 * 60 // 7 days
            },
            cacheableResponse: {
              statuses: [200]
            }
          }
        },
        // Rule for all cross-origin images (from any 3rd party domain)
        {
          urlPattern: ({ request, url }: { request: Request; url: URL }) =>
            request.destination === 'image' && url.hostname !== self.location.hostname,
          handler: 'CacheFirst',
          options: {
            cacheName: 'cross-origin-images',
            expiration: {
              maxEntries: 500,
              maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
            },
            // Crucial for 3rd-party assets that may not have proper CORS headers
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
        // A separate rule for your own, same-origin images
        {
          urlPattern: ({ request, url }: { request: Request; url: URL }) =>
            request.destination === 'image' && url.hostname === self.location.hostname,
          handler: 'CacheFirst',
          options: {
            cacheName: 'same-origin-images',
            expiration: {
              maxEntries: 500,
              maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
            }
          }
        }
      ]
    },
    registerType: 'autoUpdate',
    devOptions: { enabled: false, type: 'module' }
  },

  piniaPluginPersistedstate: { storage: 'localStorage' }
})
