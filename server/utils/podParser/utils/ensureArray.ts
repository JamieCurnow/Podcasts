/**
 * From:
 * https://github.com/krestaino/podcast-xml-parser
 *
 * Ensures that the input is an array. If the input is not an array, it is wrapped in an array.
 * If the input is null or undefined, an empty array is returned.
 *
 * @param item - The input to ensure as an array.
 * @returns An array containing the input, or an empty array if the input is null or undefined.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ensureArray = <T extends Array<unknown>>(item: unknown): T => {
  if (Array.isArray(item)) return item as T

  return item ? ([item] as T) : ([] as unknown as T)
}
