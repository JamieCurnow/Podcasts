/**
 * From:
 * https://github.com/krestaino/podcast-xml-parser
 *
 * Converts a string to a number. Returns null if the conversion fails or if the string contains non-numeric characters.
 *
 * @param value - The string value to convert.
 * @returns A number representation of the value, or null if the conversion fails or contains non-numeric characters.
 */
export function toNumber(value: string): number | null {
  if (/^\d+$/.test(value)) {
    return parseInt(value, 10)
  }
  return null
}
