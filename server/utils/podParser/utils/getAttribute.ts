/**
 * From:
 * https://github.com/krestaino/podcast-xml-parser
 *
 * Retrieves the value of a specified attribute from an object or an array of objects.
 *
 * @param obj - The object or array of objects to search.
 * @param path - The path to the attribute, separated by dots.
 * @param defaultValue - The default value to return if the attribute is not found.
 * @returns The value of the attribute, or the default value if not found.
 */
export const getAttribute = (
  obj: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  path: string,
  defaultValue: string = ''
): string => {
  const value = path.split('.').reduce((acc, part) => acc && acc[part], obj)
  let returnValue = defaultValue

  if (Array.isArray(value)) {
    if (value.length > 0 && value[0]['@_text']) {
      returnValue = value[0]['@_text']
    }
  } else if (typeof value === 'object' && value?.['#text']) {
    returnValue = value['#text']
  } else if (value !== undefined && value !== null) {
    returnValue = `${value}`
  }

  const stringReturnValue = `${returnValue}`
  return stringReturnValue.trim()
}
