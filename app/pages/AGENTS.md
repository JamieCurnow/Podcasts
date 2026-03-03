# Pages

This directory contains the pages for the application.

Pages follow a routing structure where the directory structure determines the route.
For example, app/pages/plant/[uid].vue is the handler for /plant/:uid.

There is a PAGES.md file in this directory that documents all of the pages in this directory.

- If you add a new page, it must be documented in the PAGES.md file.
- If you remove a page, it must be removed from the PAGES.md file.
- If you update a page, it must be updated in the PAGES.md file.

Whenever you make a change to the pages in this app, or if you learn something about pages that is worth preserving, you should update this file in the `## Learnings` section in this file.
Good learning additions are app-wide patterns eg:

- always use vue composition style in pages
- always define the page layout with `definePageMeta({ layout: 'layoutName' })`
- keep pages short by componentising where possible - pages should be mainly layout and routing, not business logic
- pages behind the auth layout can assume that the user is authenticated

Don't add:

- page specific details
- temporary notes
- info already in the PAGES.md file

## Learnings

- No auth is required for any page — there's no `authed` layout in use. This app is fully public/local.
- All data fetching is done in `onMounted` or via `watch`, not `useAsyncData`/`useFetch`. The app is a client-side PWA.
- Use `keepalive: true` in `definePageMeta` for pages with expensive feed fetches (home, podcast, episode) to avoid reloading on navigation.
- The home page redirects to `/start` when there are no subscriptions — always guard for this case.
- Episode pagination pattern: pass `start` and `limit` to `/api/podcast/feed`, increment `start` by `limit`. Trigger via `useElementVisibility` on a sentinel element near the bottom.
- Pull-to-refresh is rate-limited to 5 min — simulate a delay if within the window, do a real `noCache` fetch otherwise.
