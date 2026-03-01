export interface EpisodeMeta {
  /** URL of the podcast feed */
  feedUrl: string
  /** guid of the episode */
  guid: string
  /** The time into the pod in seconds - can be used to set the audio el */
  currentTime: number
  /** The duration of the pod */
  duration: number
  /** if the user has listened to the whole pod */
  finished: boolean
  /** if the user has started the pod */
  started: boolean
  /** when the user started the pod - could be used for history */
  startedAt: number
  /** when the user last listened to the pod - like if they listen again after starting */
  lastListenedAt: number
}
