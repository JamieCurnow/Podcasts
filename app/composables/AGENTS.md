This is the composables directory.
It includes all the composables used in the app.

Composables are functions that can be used to share logic between components.
They usually include some reactive state and some functions to modify that state.

There is a COMPOSABLES.md file in this directory that documents the composables in this app.

- if you add a new composable, you should add it to the COMPOSABLES.md file
- if you remove a composable, you should remove it from the COMPOSABLES.md file
- if you change an existing composable, you should update the COMPOSABLES.md file

This is the AGENTS.md file.

Whenever you make a change to the composables in this app, or if you learn something about composables that is worth preserving, you should update this file in the `## Learnings` section.

Good learning additions are composables-wide patterns eg:

- always name composables with a leading `use` prefix
- always export composables as a named export

Don't add:

- composables specific details
- temporary notes
- info already in the COMPOSABLES.md file

## Learnings

- Not all composables use the `use` prefix — `createOpml` and `parseOpml` are plain async/sync functions that are auto-imported. Reserve `use*` for composables with reactive state.
- Chapter-parsing strategies live in `chapterStrategies/` and are consumed by `useBestGuessChapters`. To add a new strategy, add it to the `bestGuessChaptersStrategies` array in `chapterStrategies/index.ts`.
- There is no `useErrorHandle` composable in this app (no auth/backend). Errors are handled inline with `try/catch` + `console.error`.
