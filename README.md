<a href="https://nuxt.com">
  <img src="https://lovepodcasts.com/icon-horizontal.svg" alt="LovePodcasts logo" width="150">
</a>

# For the love of pods! 🎧

[**Live Demo »**](https://lovepodcasts.com)

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/JamieCurnow/Podcasts)

Podcasts is an open-source podcast app with a design that pays homage to the late, great Google Podcasts. It's built with a slick, modern stack: **Nuxt 4**, **Nuxt UI**, and **Tailwind CSS**.

This is a passion project in progress. The mission is to create a simple, beautiful, and easy-to-use podcast app that's completely **free of ads and tracking**. 🕵️‍♂️

### ✨ The Philosophy

- **No Accounts, No Problem:** No need to sign up or log in. Just pure, unadulterated podcasting.
- **Back to Basics:** Add your favorite podcasts the old-school way—by pasting in the RSS feed URL. It's a beautiful ode to the open web, and feels pure.
- **PWA for the Win:** Who needs an app store? This is a Progressive Web App (PWA). Add it to your home screen on iOS or Android, and it'll feel just like a native app. Long live the web!

## Features ✅

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
- [x] Import/export OPML
- [ ] Search podcasts?
- [ ] Sleep timer
- [ ] Dockerize

## 🚀 Get It Running

Ready to host your own instance? It's super easy!

- **Cloudflare Workers:** Just click that "Deploy to Cloudflare" button above. Done.
- **Vercel, Netlify, etc:** Fork this repo, and you'll be up and running in minutes.
- **Homelab:** Host it yourself with Node.js for the ultimate control.

### Configuration

The only env var you may want to set is `CORS_DOMAINS` which is a comma-separated list of domains you want to allow CORS requests from. By default, it's set to `*` which allows all domains. For better security, you should set it to your own domain(s).

## 💻 For Developers

Contributions are what make the open-source community amazing. I'd love your help!

### Built on Nuxt 4

This project is built on a solid foundation. Check out the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

### Setup

First, get the dependencies installed:

```bash
# npm
npm install
```

### Development Server

Fire up the dev server and start coding. It'll be live at `http://localhost:3000`.

```bash
# npm
npm run dev
```

### Production

Ready to build the final version?

```bash
# npm
npm run build
```

And to preview your production build locally:

```bash
# npm
npm run preview
```

### Deployment (lovepodcasts.com)

The live site runs on **Cloudflare Workers** (Worker `podcasts-app`, custom domain `lovepodcasts.com`).

- **CI:** `.github/workflows/deploy.yml` builds every PR and deploys `main` to Cloudflare. It needs the `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` repo secrets.
- **Manual deploy:** `npm run deploy` (needs `wrangler login`).
- **Logs:** Workers Observability is on (100% sampling, invocation logs). See the `podcasts-app` Worker > Observability in the Cloudflare dashboard, or `npx wrangler tail podcasts-app`.
- **Analytics:** Cloudflare Web Analytics (cookieless) with automatic setup, so the beacon is injected at the edge. There's no tracking code in the app. Zone traffic stats are under the `lovepodcasts.com` zone > Analytics.
- **www:** `www.lovepodcasts.com` 301s to `https://lovepodcasts.com` (path + query kept) via a Single Redirect rule on the zone.

#### Rolling back to Firebase

Firebase Hosting (project `hark-pods`) is kept deployed as a fallback. To switch back:

1. Optionally redeploy the latest code there: `npm run deploy:firebase` (needs `firebase login` and the `webframeworks` experiment: `firebase experiments:enable webframeworks`).
2. In Cloudflare: Workers & Pages > `podcasts-app` > Settings > Domains & Routes, remove the `lovepodcasts.com` custom domain.
3. In the `lovepodcasts.com` DNS settings, add back `A lovepodcasts.com 199.36.158.100` as **DNS only** (grey cloud). The `TXT hosting-site=hark-pods` record must stay.

Firebase builds with its own Node preset, so nothing in the code has to change. The edge cache (`server/utils/edgeCache.ts`) is a no-op there.

