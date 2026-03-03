This is the components directory.
It includes all of the vue components in this Nuxt4 project.

When making a new component it should live here.
Components should be named in PascalCase and be placed in the appropriate directory.

The directory name will end up prefixing the component name.
For example, if you have a component named `AgentList.vue` in the `Chat` directory, it will be registered as `ChatAgentList` and used as `<ChatAgentList />`.

There is a COMPONENTS.md file in this directory that documents all of the components in this directory.

- If you add a new component, it must be documented in the COMPONENTS.md file.
- If you remove a component, it must be removed from the COMPONENTS.md file.
- If you update a component, it must be updated in the COMPONENTS.md file.

This file is AGENTS.md

Whenever you make a change to the components in this app, or if you learn something about components that is worth preserving, you should update this file in the `## Learnings` section.
Good learning additions are component-wide patterns eg:

- use defineModel() to set up a v-model
- use the TS flavour of defineProps() to define props - defineProps<{ prop: string }>()
- use withDefaults() to set default values for props - withDefaults(defineProps<{ prop: string }>(), { prop: 'default' })

Don't add:

- component specific props or details
- temporary notes
- info already in the COMPONENTS.md file

## Learnings

- This app has no auth. Use plain `$fetch` for all API calls.
- The global `<audio>` element lives in `<NowPlayingBar>`. Its `ref` is wired into `useNowPlayingStore`. Never create additional persistent audio elements.
- `<SlideUpDialog>` is the base for all bottom sheets. Use it instead of `UModal` for fullscreen mobile overlays.
- Episode action buttons follow a consistent prop signature: `{ episode: Episode, podcast: Podcast }`.
- Use `<PodCover>` (not `<img>` or `<NuxtImg>`) for all podcast images — it routes through `/api/proxy` automatically.
- `<PodPlayRow>` composes `<PodPlayChip>`, `<PodAddToQueue>`, `<PodDownload>`, and `<PodMenu>` — use it on list items, not individual buttons.
- `defineModel` is used for boolean open/close state on dialogs instead of explicit `modelValue` prop + emit.
