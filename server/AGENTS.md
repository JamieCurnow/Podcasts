# Server

This directory contains the server-side code for the application.
Utils that are specifically server-side are in server/utils.

API endpoints are in server/api.
The api endpoints follow routing similar to nuxt pages where the directory structure determines the route.
For example, server/api/plant/index.get.ts is the handler for GET /api/plant.
server/api/plant/[uid].get.ts is the handler for GET /api/plant/:uid.
server/api/plant/[uid].put.ts is the handler for PUT /api/plant/:uid.

You should always define the method as a suffix to the file name, e.g. index.get.ts, index.post.ts, etc.

API endpoints are defined with a default export of defineEventHandler().
`export default defineEventHandler(async (event) => {})`

This is an H3 handler under the hood.

There is a SERVER_ENDPOINTS.md file in this directory that documents all of the endpoints in this directory.

- If you add a new endpoint, it must be documented in the SERVER_ENDPOINTS.md file.
- If you remove an endpoint, it must be removed from the SERVER_ENDPOINTS.md file.
- If you update an endpoint, it must be updated in the SERVER_ENDPOINTS.md file.

Whenever you make a change to the endpoints or server utils, or if you learn something worth preserving, update the `## Patterns & Learnings` section in the relevant catalog file (`SERVER_ENDPOINTS.md` or `SERVER_UTILS.md`).

## Auth, validation & errors

There's no auth and no database: all endpoints are public. There's no `readZodBody`, `getSafeRouterParam` or `serverError` helper here. Validate query params by hand and throw with `createError` (see `.agent/rules/error-handling.md`).

## Caching

The live site runs on Cloudflare Workers, which doesn't CDN-cache Worker responses. If an endpoint's response should be cached at the edge, use `matchEdgeCache` / `putEdgeCache` from `server/utils/edgeCache.ts` (see SERVER_UTILS.md).
