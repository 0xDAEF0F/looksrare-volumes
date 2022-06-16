import { dateToLooksUnixTimestamp } from 'api/utils/Date/dateConverter'
import { request, gql } from 'graphql-request'
import { ExchangeDailyDatasResponse } from './getExchangeDailyDatasByDate.ts'

const gqlQuery = gql`
  query ($date: BigInt!) {
    exchangeDailyDatas(
      orderDirection: desc
      orderBy: date
      first: 1000
      where: { date_lte: $date }
    ) {
      id
      date
      dailyUsers
      dailyVolumeExcludingZeroFee
      dailyVolume
      dailyTransactions
    }
  }
`
export async function getLast1000ExchangeDailyDatas() {
  const res = (await request(process.env.LOOKSRARE_SUBGRAPH_URL as string, gqlQuery, {
    date: dateToLooksUnixTimestamp(new Date()),
  })) as ExchangeDailyDatasResponse
  return res.exchangeDailyDatas
}
