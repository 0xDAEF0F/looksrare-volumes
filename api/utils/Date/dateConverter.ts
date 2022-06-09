// LooksRare subgraph only understands UTC times

export function dateToLooksUnixTimestamp(date: Date) {
  const yearOfDate = date.getUTCFullYear()
  const monthOfDate = date.getUTCMonth()
  const dayOfDate = date.getUTCDate()
  //   get GMT seconds (format that LooksRare understands)
  const looksDateFormat = Date.UTC(yearOfDate, monthOfDate, dayOfDate) / 1000
  return looksDateFormat
}

export function looksUnixTimestampToDate(timestamp: number) {
  return new Date(timestamp * 1000).toISOString()
}

export function dateToISOStringUTCTime(date: Date) {
  const year = date.getUTCFullYear()
  const month = date.getUTCMonth()
  const day = date.getUTCDate()
  // new Date
  const newDate = new Date(year, month, day)
  // set UTC to +0
  newDate.setUTCHours(0, 0, 0, 0)
  // return ISO String (db format)
  return newDate.toISOString()
}
