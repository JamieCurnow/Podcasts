import type { Episode } from './Episode'
import type { Podcast } from './Podcast'

export interface Playlist {
  id: string
  name: string
  description?: string
  items: { podcast: Podcast; episode: Episode }[]
  createdAt: number
  updatedAt: number
}
