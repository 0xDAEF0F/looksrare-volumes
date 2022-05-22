// LooksRare subgraph only understands UTC times
// You can pass a date object or timestamp in string or number

export function dateToLooksUnixTimestamp(date: Date) {
  const yearOfDate = date.getFullYear()
  const monthOfDate = date.getMonth()
  const dayOfDate = date.getDate()
  //   get GMT seconds (format that LooksRare understands)
  const looksDateFormat = Date.UTC(yearOfDate, monthOfDate, dayOfDate) / 1000
  return looksDateFormat
}

export function looksUnixTimestampToDate(timestamp: number) {
  return new Date(timestamp * 1000).toISOString()
}
