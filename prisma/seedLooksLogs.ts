import { roundDownUtcDate } from 'api/utils/Date/dateConverter'
import { getLooksExchangeDailyDatas } from 'api/utils/TheGraph/getLooksDailyLogs'
import { map, range } from 'lodash'

const SECONDS_ONE_DAY = 86400 as const
type DaysToQuote = number

export function getLooksLogsForXLastDays(days: DaysToQuote) {
  const now = roundDownUtcDate(Date.now())
  const sequenceOfDays = map(range(days), (a) => SECONDS_ONE_DAY * a)
  const timestampsToQuery = map(range(days), (_, i) => now - sequenceOfDays[i])

  return map(timestampsToQuery, (a) => {
    return getLooksExchangeDailyDatas(a)
  })
}
