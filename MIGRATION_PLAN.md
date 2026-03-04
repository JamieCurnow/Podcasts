# Migration Plan: @nuxt/ui v2→v4 + Tailwind v3→v4

## Overview

- **@nuxt/ui**: `^2.19.2` → `^4.x`
- **tailwindcss**: implicit v3 (via nuxt/ui v2) → explicit v4 (CSS-first config)
- **Nuxt**: already on v4 ✓

---

## Checklist

### \1. [x] Install updated packages

```bash
bun add @nuxt/ui@^4 tailwindcss
```

Nuxt UI v4 bundles Tailwind v4. No separate `tailwindcss` config package needed.

---

### \1. [x] Delete `tailwind.config.ts`

Tailwind v4 is CSS-first. This file is no longer needed. The font and color
customisations will move to `main.css` in the `@theme` block.

---

### \1. [x] Rewrite `app/assets/css/main.css`

Replace the current file with:

```css
@import "tailwindcss";
@import "@nuxt/ui";

@theme {
  /* Font family (replaces tailwind.config.ts extend.fontFamily) */
  --font-sans: "Noto Sans", ui-sans-serif, system-ui, sans-serif;
}

/* ---- App-level styles (unchanged) ---- */
html {
  @apply text-neutral-900 bg-neutral-50;
}

html.dark {
  @apply text-neutral-300 bg-neutral-900;
}

body {
  overscroll-behavior-y: contain;
}

.disable-scroll {
  overflow: hidden;
  width: 100%;
}

a {
  @apply underline font-bold hover:opacity-80;
}
```

Notes:
- The `@theme` block replaces `tailwind.config.ts` for font customisation.
- Colors (stone, neutral etc.) are all included in Tailwind v4 by default — no
  need to explicitly import them like in v3.
- `@apply` still works in v4 ✓

---

### \1. [x] Update `app.config.ts` — color system + component config

Nuxt UI v4 uses a semantic colour system. Replace the v2 `ui.primary/gray/neutral`
top-level keys with `ui.colors`:

```ts
export default defineAppConfig({
  ui: {
    colors: {
      primary: 'stone',
      neutral: 'neutral'
    }
    // ... component overrides (see notes below)
  }
})
```

**Component config changes in v4:**

The component theme keys have changed significantly. Most of the v2 deep-path
overrides (`ui.input.placeholder`, `ui.dropdown.background`, etc.) will need to
be re-mapped or removed — the v4 component theming uses a different class/variant
system built on `tv()` (tailwind-variants).

Recommended approach: **start with minimal config** (just `ui.colors`) and add
back customisations one at a time while testing visually. The v2 config will
likely cause console warnings or be silently ignored.

Specific items to re-evaluate:
- `ui.button.variant.ghost` — check if ghost variant override still works
- `ui.input.*` — padding, size, color overrides: paths likely changed
- `ui.range.thumb` — `URange` is now `USlider`; thumb styling path changed
- `ui.dropdown.*` — `UDropdown` is now `UDropdownMenu`; config paths changed
- `ui.slideover.background` — check if still valid
- `ui.notification.*` / `ui.notifications.*` — replaced by toast/toaster system
- `ui.primary/gray/neutral/stone` top-level keys — remove, use `ui.colors` instead

---

### \1. [x] Wrap app in `<UApp>` — `app/app.vue`

Nuxt UI v4 requires `<UApp>` as the root wrapper. It provides the Toaster
(replaces UNotifications) and other global providers.

```vue
<template>
  <UApp>
    <NuxtPwaAssets />
    <NuxtLayout>
      <KeepAlive>
        <NuxtPage />
      </KeepAlive>
    </NuxtLayout>
  </UApp>
</template>
```

---

### \1. [x] Remove `<UNotifications />` — `app/layouts/default.vue`

`UNotifications` is replaced by the Toaster inside `<UApp>`. Remove the line:

```html
<UNotifications />  ← delete this
```

The `useToast()` composable API is unchanged, so existing toast calls will
continue to work automatically.

---

### \1. [x] Rename `UDropdown` → `UDropdownMenu` — `app/components/PodMenu.vue`

In v4 the component is `UDropdownMenu`. Also update:

- Import type: `DropdownItem` → `DropdownMenuItem`
- `:popper` prop is removed; use `:content` with Reka UI placement options
- Item `click:` handler → `onSelect:` handler

```vue
<!-- Before -->
<UDropdown :items="items" mode="click" :popper="{ placement: 'bottom-start', offsetDistance: 0 }">

<!-- After -->
<UDropdownMenu :items="items" :content="{ align: 'start' }">
```

In `<script setup>`:
```ts
// Before
import type { DropdownItem } from '#ui/types'
// items: { label, icon, click: () => {} }

// After
import type { DropdownMenuItem } from '#ui/types'
// items: { label, icon, onSelect: () => {} }
```

---

### \1. [x] Rename `URange` → `USlider` — 2 files

**`app/components/CurrentPodcastDialog.vue`**
```html
<!-- Before -->
<URange ...>
<!-- After -->
<USlider ...>
```

**`app/components/PlaybackSpeedDialog.vue`**
```html
<!-- Before -->
<URange v-model="userConfigStore.playbackSpeed" :min="0.8" :max="2" :step="0.1" />
<!-- After -->
<USlider v-model="userConfigStore.playbackSpeed" :min="0.8" :max="2" :step="0.1" />
```

Note: `USlider` v-model value might need to be wrapped in an array for single-thumb
sliders in some v4 versions — test this.

---

### \1. [x] Update `UModal` v-model — 3 files

`v-model` → `v-model:open`. Also remove `:overlay="true"` (overlay is on by default).

In v4, UModal uses a trigger+content slot pattern OR direct `v-model:open` control.
Since these dialogs use `defineModel` to control open state from parents, use
`v-model:open`:

**`app/components/ImportOPMLDialog.vue`**
```html
<!-- Before: <UModal v-model="open" :overlay="true"> -->
<UModal v-model:open="open">
```

**`app/components/ExportOPMLDialog.vue`** — same change

**`app/components/ManageSubsDialog.vue`**
```html
<!-- Before: <UModal v-model="open"> -->
<UModal v-model:open="open">
```

**Note on UCard inside UModal:** In v4, UModal has its own `#header`, `#body`,
`#footer` slots. The `<UCard>` wrapper inside `<UModal>` may be unnecessary or
cause double-styling. Check visually — may need to replace `<UCard>` with the
modal's named slots.

---

### \1. [x] Update `USlideover` v-model — `app/components/NavMenu.vue`

```html
<!-- Before: <USlideover v-model="isOpen"> -->
<USlideover v-model:open="isOpen">
```

In v4, USlideover uses named slots (`#content`, `#header`, `#body`, `#footer`).
The current bare `<div>` content in the default slot may need to move to `#content`.
Test visually.

---

### \1. [x] Replace `color="gray"` with `color="neutral"` — multiple files

In Nuxt UI v4, `gray` is no longer a semantic colour. Use `neutral` instead.

Files and locations:
- `app/components/ImportOPMLDialog.vue:41` — Cancel button `color="gray"`
- `app/components/ExportOPMLDialog.vue` — Cancel button `color="gray"`
- `app/pages/start.vue:14,36` — buttons with `color="gray"`

```html
<!-- Before -->
<UButton color="gray">...</UButton>
<!-- After -->
<UButton color="neutral">...</UButton>
```

---

### \1. [x] Fix `color="green"` — `app/components/ImportOPMLDialog.vue:47`

Nuxt UI v4 semantic colours are: `primary`, `secondary`, `success`, `info`,
`warning`, `error`, `neutral`. The literal `green` is not a valid semantic colour.

Options:
- Change to `color="success"` (semantic green-ish)
- Or register `green` as a custom semantic colour in `app.config.ts` ui.colors

Recommendation: `color="success"` for Import button.

---

### \1. [x] Verify icon names still work

Nuxt UI v4 still uses Iconify icons via `UIcon` with the `i-*` pattern. Since
`@iconify-json/mdi` and `@iconify-json/ic` are explicitly installed in package.json,
icons should work as-is. Verify a few icons render after the migration.

---

### \1. [x] Remove `mode="click"` prop from UDropdownMenu (if it exists)

In PodMenu.vue, the old `UDropdown` had `mode="click"`. Check if `UDropdownMenu`
still has this prop — in v4 click mode may be the default or handled differently.

---

### \1. [x] Test and fix app.config.ts component overrides

After the above changes, run `bun run dev` and visually check:
- Input styling (size, padding, ring, placeholder)
- Dropdown appearance (background, ring, item size)
- Button ghost variant
- Slider (was Range) thumb appearance
- Slideover background
- Modal overlay appearance
- Toast notifications

Re-apply necessary overrides using v4 config structure (consult
https://ui.nuxt.com/components/[component] for each component's `theme` section).

---

## File Change Summary

| File | Change |
|------|--------|
| `package.json` | Update `@nuxt/ui` to v4, add `tailwindcss` |
| `tailwind.config.ts` | **Delete** |
| `app/assets/css/main.css` | Add imports + @theme block |
| `app/app.vue` | Wrap in `<UApp>` |
| `app/layouts/default.vue` | Remove `<UNotifications />` |
| `app/app.config.ts` | Restructure colours, audit component overrides |
| `app/components/PodMenu.vue` | `UDropdown`→`UDropdownMenu`, item type, props |
| `app/components/CurrentPodcastDialog.vue` | `URange`→`USlider` |
| `app/components/PlaybackSpeedDialog.vue` | `URange`→`USlider` |
| `app/components/ImportOPMLDialog.vue` | `v-model`→`v-model:open`, `color="gray"`→`neutral`, `color="green"`→`success` |
| `app/components/ExportOPMLDialog.vue` | `v-model`→`v-model:open`, `color="gray"`→`neutral` |
| `app/components/ManageSubsDialog.vue` | `v-model`→`v-model:open` |
| `app/components/NavMenu.vue` | `v-model`→`v-model:open` |
| `app/pages/start.vue` | `color="gray"`→`neutral` |
