<a href="https://nuxt.com">
  <img src="https://lovepodcasts.com/icon-horizontal.svg" alt="LovePodcasts logo" width="150">
</a>

# Podcasts

Demo: <https://lovepodcasts.com>

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/JamieCurnow/Podcasts)

Podcasts is an open source podcast app with designs inspired by the late, great, Google Podcasts. It's built with Nuxt 3, Tailwind CSS, and Vite. It's a work in progress, but the goal is to have a simple, easy-to-use podcast app that is free of ads and tracking.

The UI is heavily inspired by the great, late Google Podcasts, which I used and loved for years.

There will be no account, syncing, or search. You'll need to add your podcasts manually by pasting in the RSS feed URL.

It feels quite pure that way, and stays true to RSS and the open web.

There will not be an app store app. It's a PWA, so you can add it to your home screen on iOS and Android and it will work like a native app. Long live the web!

## Features

- [x] Add podcasts by RSS feed URL
- [x] View podcast details and episode list
- [x] View episode details
- [x] Chapters support
- [x] Listen to episodes
- [x] Playback speed control
- [x] Mark episodes as played/unplayed
- [x] Download episodes for offline listening
- [x] Queue episodes to play next
- [x] Bookmark timestamps in episodes
- [x] History of played episodes
- [x] Dark mode
- [ ] Import/export OPML
- [ ] Search podcasts?
- [ ] Sleep timer
- [ ] Dockerize

## Deployment

Deploy your own instance of Podcasts to Cloudflare Workers by clicking the button above, or check out the Nitro documentation to deploy to other platforms.

You should be able to fork this repo and get up and running very quickly on Vercel, Netlify etc.

Or host it on your homelab with Node.js.

## Developers

Contributions are welcome!

### Based on the Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

### Setup

Make sure to install the dependencies:

```bash
# npm
npm install
```

### Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev
```

### Production

Build the application for production:

```bash
# npm
npm run build
```

Locally preview production build:

```bash
# npm
npm run preview
```
