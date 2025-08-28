import { pawIconLinks } from './utils/pwaIconLinks'

// stop 404 api responses from being cached (see https://firebase.google.com/docs/hosting/manage-cache)
const noCache = () => ({
  headers: { 'Cache-Control': 'private, no-cache, no-store, max-age=0, must-revalidate, s-maxage=0' }
})

const preRenderRoutes = [
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
    'pinia-plugin-persistedstate/nuxt'
  ],

  imports: { dirs: ['~/types'] },

  typescript: {
    tsConfig: {
      exclude: ['.firebase']
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
        { name: 'mobile-web-app-capable', content: 'yes' }
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
      runtimeCaching: [
        {
          // url pattern to match all routes
          urlPattern: '/*',
          // use "network first" strategy: try network first, fallback to cache if offline
          handler: 'CacheFirst'
        },
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'image-cache',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
            }
          }
        }
      ],
      // fallback url when offline
      navigateFallback: '/'
    },
    registerType: 'autoUpdate',
    devOptions: { enabled: false, type: 'module' }
  },

  piniaPluginPersistedstate: { storage: 'localStorage' }
})
