---
trigger: always_on
---

# Error Handling |

## Frontend

Wrap fetches and other calls that can fail in `try/catch`. Tell the user with a toast (`useToast()` from Nuxt UI) when it affects them, and keep the UI usable (e.g. show cached store data if a feed refresh fails).

There is no `useErrorHandle` helper in this project.

## Server

Throw H3 errors with `createError`:

```ts
if (!url) throw createError({ statusCode: 400, statusMessage: 'URL is required' })
```

Don't return raw upstream errors or stack traces to the client. Log the detail and throw a generic message.

There is no `serverError` helper in this project.
