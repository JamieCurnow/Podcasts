# Pinia Stores

The files in this directory are pinia stores for the application used to store global state.

There is a STORES.md file that documents the stores that are available in the application.

- If you add a new store, it must be documented in the STORES.md file.
- If you remove a store, it must be removed from the STORES.md file.
- If you update a store, it must be updated in the STORES.md file.

Whenever you make a change to the stores in this app, or if you learn something about stores that is worth preserving, you should update this file in the `## Learnings` section in this file.
Good learning additions are app-wide patterns eg:

- always use vue composition style in stores
- always use storeToRefs() to destructure refs from the store
- always use store setup style `export default defineStore('storeName', () => {})`
- if you use one store in another store, you must initialise the store by passing in the pinia instance eg: `const store = useStore(usePinia())`

Don't add:

- store specific details
- temporary notes
- info already in the STORES.md file

## Learnings

- All stores are persisted via `pinia-plugin-persistedstate`. Use `persist: { key: 'pod_persist_*', pick: [...] }`. Always prefix keys with `pod_persist_`.
- There is no Firebase or MongoDB backend — stores ARE the source of truth. Don't add server sync unless the architecture changes.
- `useNowPlayingStore` owns the `<audio>` element. Other stores must not touch audio directly.
- Cross-store calls are common (e.g. `nowPlayingStore` calls `subsStore.updateEpisodeMeta`). In the setup syntax you can call `useOtherStore()` directly inside another store — no need to pass the pinia instance.
- `useDownloadsStore` is the only store that touches IndexedDB. Its IndexedDB helpers (`getBlobFromIndexedDB`, `saveBlobToIndexedDB`) are exported from the store file and used by `nowPlayingStore` to load downloaded audio.
