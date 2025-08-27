/**
 * From:
 * https://github.com/krestaino/podcast-xml-parser
 *
 * Converts a string to a boolean value. Handles case-insensitive "Yes" and "No" strings.
 *
 * @param value - The string value to convert.
 * @returns A boolean representation of the value.
 */
export function toBoolean(value: string | boolean): boolean {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') {
    const lowerValue = value.toLowerCase()
    const truthyValues = ['true', '1', 'yes']
    return truthyValues.includes(lowerValue)
  }
  return false
}
