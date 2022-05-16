import { dateToLooksUnixTimestamp } from 'api/utils/Date/dateConverter'
import { getLooksLogsByDate } from 'api/utils/TheGraph/LooksRare/getLogByDate'
import { map, range } from 'lodash'

const SECONDS_ONE_DAY = 86400 as const
type DaysToQuote = number

export function getLastXDaysLogs(days: DaysToQuote) {
  const now = dateToLooksUnixTimestamp(new Date())
  const sequenceOfDays = map(range(days), (a) => SECONDS_ONE_DAY * a)
  const timestampsToQuery = map(range(days), (_, i) => now - sequenceOfDays[i])

  return map(timestampsToQuery, (a) => {
    return getLooksLogsByDate(a)
  })
}

export function getLastDayExchangeLog() {
  return getLooksLogsByDate(dateToLooksUnixTimestamp(new Date()))
}
