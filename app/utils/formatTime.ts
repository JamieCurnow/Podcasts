/** Formats seconds into a display-friendly time string (e.g. "1:23", "1:01:05"). Trims leading zeros. */
export const formatTime = (time: number) => {
  if (!time) return '00:00'
  const hours = Math.floor(time / 3600)
  const minutes = Math.floor((time % 3600) / 60)
  const seconds = Math.floor(time % 60)
  const text = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  // trim any leading 0s and : chars. Eg. 00:00:01 => 1 and 01:01:01 => 1:01:01
  return text.replace(/^00:?/g, '')
}

/** Formats seconds into zero-padded HH:MM:SS (or MM:SS if no hours). Used for chapter timestamps. */
export const formatTimePadded = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  const parts = []
  if (hours > 0) parts.push(hours.toString().padStart(2, '0'))
  parts.push(minutes.toString().padStart(2, '0'))
  parts.push(seconds.toString().padStart(2, '0'))

  return parts.join(':')
}
