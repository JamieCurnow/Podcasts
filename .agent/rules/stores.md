---
trigger: always_on
---

# Stores |

Pinia stores are used for global state management.

1. **Check Existing**: Before creating new global state, check if it already exists in an existing store or if it can be added to one. See `app/stores/STORES.md`.
2. **Componentize**: Prefer local component state (`ref`, `reactive`) unless the data needs to be shared across multiple pages or components.
3. **Documentation**: Always update `app/stores/STORES.md` when creating or modifying a store.
4. **HMR**: Ensure your store includes the HMR update block:

```ts
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMyStore, import.meta.hot))
}
```

Read /app/stores/AGENTS.md for guidance when creating or updating stores.
