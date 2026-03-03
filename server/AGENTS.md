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

Whenever you make a change to the endpoints in this app, or if you learn something about endpoints that is worth preserving, you should update this file in the `## Learnings` section in this file.
Good learning additions are app-wide patterns eg:

- Always check that documents from the db exist and 404 if they don't.

Don't add:

- endpoint specific details
- temporary notes
- info already in the SERVER_ENDPOINTS.md file

## Auth

Auth should be handled as the first thing in the handler. We have some utils that help with this:

- useServerAuthWithError
  - eg: const { user, authUser } = await useServerAuthWithError(event)
  - This will auth the user and throw a 401 error if the user is not authenticated.
- useServerAuth

  - eg:

  ```
  const auth = await useServerAuth(event)
  if (!auth) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  const { user, authUser } = auth
  ```

  - this is helpful if you need to do more complex auth logic rather than just 401.

## Validation

Use `readZodBody` to validate the request body.

eg:

```ts
const bodySchema = z.object({
  name: z.string(),
  age: z.number()
})
const { name, age } = await readZodBody(event, bodySchema)
```

That will throw a 400 error if the body is invalid.

use `getSafeRouterParam` to get a router param.
eg:
path: '/api/user/[uid]'

```ts
const uid = getSafeRouterParam(event, 'uid')
```

## Errors

There is an auto-imported `serverError` function that can be used to throw errors.
This will automatically generate an appropriate error message for common status codes,
or you can add a custom message as the second argument.

eg:

```ts
throw serverError(404)
```

or

```ts
throw serverError(404, 'User not found')
```

You do not need to wrap the whole handler in a try/catch block as there is a middleware
the will catch, log, and return the error to the client.

## Learnings

- This app has **no MongoDB, no Firebase auth**. The AGENTS.md template mentions them but they are unused here. Don't add auth or DB calls.
- The only two server routes are `/api/podcast/feed` (RSS parsing) and `/api/proxy` (general proxy).
- All RSS parsing logic is in `server/utils/podParser/`. It's a self-contained custom implementation — don't replace it with an npm package without good reason.
- Episode pagination is done by slicing in `fetchPodcastFeed` — the full feed XML is always parsed first, then sliced. This works fine for typical feeds.
- The proxy endpoint reads `CORS_DOMAINS` from env to restrict allowed origins. In dev this defaults to `*`.
