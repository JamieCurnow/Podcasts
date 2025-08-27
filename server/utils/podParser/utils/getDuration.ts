/**
 * Inspired by
 * https://github.com/krestaino/podcast-xml-parser
 *
 * Parses a time string or number and returns the duration in seconds.
 *
 * @param time - The time string or number to parse. It can be in the format of "HH:MM:SS", "MM:SS", or a numerical value representing seconds.
 * @returns The duration in seconds as a number. If the input is invalid, it returns 0.
 */

export const getDuration = (time: unknown): number => {
  if (typeof time !== 'string' && typeof time !== 'number') {
    return 0
  }

  if (typeof time === 'string') {
    if (time === '') {
      return 0
    }

    // Check if the time string is in the format of HH:MM:SS or MM:SS
    const timeRegex = /^(?:(\d{1,2}):)?(\d{1,2}):(\d{1,2})$/
    const match = time.match(timeRegex)
    if (match != null) {
      const hours = parseInt(match[1] ?? '0', 10)
      const minutes = parseInt(match[2], 10)
      const seconds = parseInt(match[3], 10)
      return hours * 3600 + minutes * 60 + seconds
    } else if (!isNaN(Number(time))) {
      // If the time string is a numerical value, parse it as an integer
      return parseInt(time, 10)
    }
  } else if (typeof time === 'number') {
    // If the time is already a number, return it
    return time
  }

  // If the time is in an invalid format, return 0
  return 0
}
