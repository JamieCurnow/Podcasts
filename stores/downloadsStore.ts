import { openDB } from 'idb'
import type { Episode, Podcast } from '~/types/index'
import { getProxyUrl } from '~/utils/getProxyUrl'

export interface Download {
  src: string
  progress: number
  feedUrl: string
  episodeGuid: string
  status: 'completed' | 'inProgress' | 'failed' | 'paused'
  mimeType: string
  timeStamp: number
  podcast: Podcast
  episode: Episode
}

export const useDownloadsStore = defineStore(
  'downloads',
  () => {
    const downloads = ref<Download[] | undefined>(undefined)

    const getDownload = (opts: { feedUrl: string; episodeGuid: string }) => {
      const { feedUrl, episodeGuid } = opts
      return computed(() => {
        return downloads.value?.find((d) => d.feedUrl === feedUrl && d.episodeGuid === episodeGuid)
      })
    }

    const startDownload = async (opts: { episode: Episode; podcast: Podcast }) => {
      const feedUrl = opts.podcast.feedUrl
      const episodeGuid = opts.episode.guid
      const src = opts.episode.enclosure.url

      if (!downloads.value) downloads.value = []

      let downloadsIndex = downloads.value.findIndex(
        (d) => d.feedUrl === feedUrl && d.episodeGuid === episodeGuid
      )

      // add the download to the downloads array if it doesn't already exist
      if (downloadsIndex === -1) {
        const download: Download = {
          src,
          progress: 0,
          feedUrl,
          episodeGuid,
          status: 'inProgress',
          mimeType: `audio/${src.split('.').pop()}`,
          timeStamp: Date.now(),
          podcast: opts.podcast,
          episode: opts.episode
        }
        downloads.value.push(download)
        downloadsIndex = downloads.value.length - 1
      }

      const type = `audio/${src.split('.').pop()}`
      await downloadAudioFile(src, type, (progress) => {
        if (!downloads.value) return
        downloads.value[downloadsIndex].progress = Math.round(progress)
        downloads.value[downloadsIndex].status = 'inProgress'
      })

      // make sure the progress is set to 100% when the download is complete
      downloads.value[downloadsIndex].progress = 100
      downloads.value[downloadsIndex].status = 'completed'
    }

    const deleteDownload = async (opts: { feedUrl: string; episodeGuid: string }) => {
      const { feedUrl, episodeGuid } = opts
      if (!downloads.value) return

      const downloadIndex = downloads.value.findIndex(
        (d) => d.feedUrl === feedUrl && d.episodeGuid === episodeGuid
      )
      if (downloadIndex === -1) return

      const download = downloads.value?.[downloadIndex]
      if (!download) return

      try {
        // delete the download from indexedDB
        await deleteFileFromIndexedDB(download.src)
        // delete the download from the downloads array
        downloads.value?.splice(downloadIndex, 1)
      } catch (e) {
        console.error(e)
      }
    }

    return {
      downloads,
      getDownload,
      startDownload,
      deleteDownload
    }
  },
  {
    persist: {
      key: 'pod_persist_downloads',
      pick: ['downloads']
    }
  }
)

/**
 * A function that I can pass a url of an audio file in to and it will save the
 * file to indexedDB and return the id of the file in indexedDB. It should take
 * a callback function for progress updates. And it should return a promise that
 * resolves with the id of the file in indexedDB.
 */
export const downloadAudioFile = async (
  url: string,
  type: string,
  progressCallback: (progress: number) => void
): Promise<string> => {
  console.log('downloadAudioFile')

  // check if we already have the file in indexedDB
  // if we do, resolve with the id
  const existingFile = await getBlobFromIndexedDB(url, type)
  if (existingFile) return url

  // if we don't, download the file and save it to indexedDB
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    const proxyUrl = getProxyUrl({ url })
    xhr.open('GET', proxyUrl, true)
    xhr.responseType = 'blob'
    xhr.onprogress = (e) => {
      if (e.lengthComputable) {
        const progress = (e.loaded / e.total) * 100
        progressCallback(progress)
      }
    }
    xhr.onload = async () => {
      if (xhr.status === 200) {
        const blob = xhr.response
        const id = await saveBlobToIndexedDB(blob, url)
        resolve(id)
      } else {
        reject(new Error('Failed to download file'))
      }
    }
    xhr.send()
  })
}

/**
 * A function that I can pass a blob to and it will save the blob to indexedDB
 * and return the id of the file in indexedDB. It should return a promise that
 * resolves with the id of the file in indexedDB.
 */
export const saveBlobToIndexedDB = async (blob: Blob, id: string): Promise<string> => {
  // Increment the version number if you've made changes to the database structure
  // after the initial creation.
  const db = await openDB('podcasts', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('audioFiles')) {
        db.createObjectStore('audioFiles')
      }
    }
  })
  const buffer = await blobToArrayBuffer(blob)
  await db.put('audioFiles', buffer, id)
  db.close()
  return id
}

/**
 * A function that I can pass an id of a file in indexedDB to and it will return
 * the blob of the file. It should return a promise that resolves with the blob
 * of the file in indexedDB.
 */
export const getBlobFromIndexedDB = async (id: string, type: string): Promise<Blob | undefined> => {
  // Ensure the version number is correct. Increment it if you've made changes to the schema after the initial creation.
  const db = await openDB('podcasts', 1, {
    upgrade(db) {
      // Create the 'audioFiles' object store if it doesn't exist.
      if (!db.objectStoreNames.contains('audioFiles')) {
        db.createObjectStore('audioFiles')
      }
    }
  })
  const buffer: Buffer | undefined = await db.get('audioFiles', id)
  db.close()
  if (!buffer) return
  return arrayBufferToBlob(buffer, type)
}

const blobToArrayBuffer = (blob: Blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.addEventListener('loadend', () => {
      resolve(reader.result)
    })
    reader.addEventListener('error', reject)
    reader.readAsArrayBuffer(blob)
  })
}

const arrayBufferToBlob = (buffer: Buffer, type: string) => {
  return new Blob([buffer], { type })
}

// Function to delete a file from indexedDB
const deleteFileFromIndexedDB = async (id: string) => {
  const db = await openDB('podcasts', 1)
  await db.delete('audioFiles', id)
  db.close()
}
