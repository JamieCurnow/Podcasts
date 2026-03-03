---
trigger: always_on
---

# Components |

When creating components, think about the props that may be passed in.
Always use the typed style of props (vue's defineProps) and use `withDefaults` if you need to add defaults.

```
const props = withDefaults(defineProps<{
  file: FileObject | null;
  files?: FileObject[];
  currentIndex?: number;
}>(), {
  files: () => [],
})
```

Use the built in defineModel if you need to hook up a v-model. Multiple named v-models can also be set up.
If the component needs to talk to the parent use emit.

Always document the component in /app/components/COMPONENTS.md when you create or update it.

Read /app/components/AGENTS.md for guidance when creating or updating components.
