export const getTimeLeftText = (time: number) => {
  if (!time) return ''
  const hours = Math.floor(time / 3600)
  const minutes = Math.floor((time % 3600) / 60)
  if (hours > 0) return `${hours}hr ${minutes}min left`
  return `${minutes}min left`
}
