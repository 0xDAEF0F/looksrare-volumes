// LooksRare subgraph only understands UTC times
// You can pass a date object or timestamp in string or number

export function roundDownUtcDate<T>(date: T) {
  if (date instanceof Date) return treatDateObject(date)
  if (typeof date === 'number') return treatNumberTimestamp(date)
  if (typeof date === 'string') return treatStringTimestamp(date)
  throw new Error('unsupported type.')
}

function treatNumberTimestamp(timestamp: number) {
  return treatDateObject(new Date(timestamp))
}

function treatStringTimestamp(timestamp: string) {
  return treatDateObject(new Date(Number(timestamp)))
}

function treatDateObject(date: Date) {
  const yearOfDate = date.getFullYear()
  const monthOfDate = date.getMonth()
  const dayOfDate = date.getDate()
  //   get GMT seconds (format that LooksRare understands)
  const looksDateFormat = Date.UTC(yearOfDate, monthOfDate, dayOfDate) / 1000
  return looksDateFormat
}
