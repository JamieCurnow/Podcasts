import type { Episode, Playlist, Podcast } from '~~/shared/types/index'

export const usePlaylistsStore = defineStore(
  'playlists',
  () => {
    const playlists = ref<Playlist[]>([])

    const getPlaylist = (uuid: string) => computed(() => playlists.value.find((p) => p.id === uuid))

    const createPlaylist = (opts: { name: string; description?: string }) => {
      const playlist: Playlist = {
        id: crypto.randomUUID(),
        name: opts.name,
        description: opts.description,
        items: [],
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
      playlists.value.unshift(playlist)
      return playlist
    }

    const deletePlaylist = (uuid: string) => {
      playlists.value = playlists.value.filter((p) => p.id !== uuid)
    }

    const updatePlaylist = (uuid: string, opts: { name?: string; description?: string }) => {
      const playlist = playlists.value.find((p) => p.id === uuid)
      if (!playlist) return
      if (opts.name !== undefined) playlist.name = opts.name
      if (opts.description !== undefined) playlist.description = opts.description
      playlist.updatedAt = Date.now()
    }

    const addToPlaylist = (uuid: string, opts: { podcast: Podcast; episode: Episode }) => {
      const playlist = playlists.value.find((p) => p.id === uuid)
      if (!playlist) return
      const exists = playlist.items.some(
        (item) => item.podcast.feedUrl === opts.podcast.feedUrl && item.episode.guid === opts.episode.guid
      )
      if (exists) return
      playlist.items.push({ podcast: opts.podcast, episode: opts.episode })
      playlist.updatedAt = Date.now()
    }

    const removeFromPlaylist = (uuid: string, opts: { feedUrl: string; guid: string }) => {
      const playlist = playlists.value.find((p) => p.id === uuid)
      if (!playlist) return
      playlist.items = playlist.items.filter(
        (item) => !(item.podcast.feedUrl === opts.feedUrl && item.episode.guid === opts.guid)
      )
      playlist.updatedAt = Date.now()
    }

    const reorderPlaylist = (uuid: string, fromIndex: number, toIndex: number) => {
      const playlist = playlists.value.find((p) => p.id === uuid)
      if (!playlist) return
      const item = playlist.items.splice(fromIndex, 1)[0]
      if (!item) return
      playlist.items.splice(toIndex, 0, item)
      playlist.updatedAt = Date.now()
    }

    return {
      playlists,
      getPlaylist,
      createPlaylist,
      deletePlaylist,
      updatePlaylist,
      addToPlaylist,
      removeFromPlaylist,
      reorderPlaylist
    }
  },
  {
    persist: {
      key: 'pod_persist_playlists',
      pick: ['playlists']
    }
  }
)
