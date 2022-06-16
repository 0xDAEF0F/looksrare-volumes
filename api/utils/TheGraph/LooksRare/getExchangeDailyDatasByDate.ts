import { dateToLooksUnixTimestamp } from 'api/utils/Date/dateConverter'
import { request, gql } from 'graphql-request'

export type ExchangeDailyDatasResponse = {
  exchangeDailyDatas: {
    id: string
    date: string
    dailyUsers: string
    dailyVolumeExcludingZeroFee: string
    dailyVolume: string
    dailyTransactions: string
  }[]
}

const gqlQuery = gql`
  query ($date: BigInt!) {
    exchangeDailyDatas(where: { date: $date }) {
      id
      date
      dailyUsers
      dailyVolumeExcludingZeroFee
      dailyVolume
      dailyTransactions
    }
  }
`

// x day exchange daily datas
export async function getExchangeDailyDatasByDate(date: number) {
  const { exchangeDailyDatas } = (await request(
    process.env.LOOKSRARE_SUBGRAPH_URL as string,
    gqlQuery,
    {
      date: date,
    }
  )) as ExchangeDailyDatasResponse

  const dailyDatas = exchangeDailyDatas.shift()

  if (!dailyDatas) throw new Error()

  return {
    ...dailyDatas,
    dailyUsers: Number(dailyDatas.dailyUsers),
    dailyVolume: Number(dailyDatas.dailyVolume),
    dailyTransactions: Number(dailyDatas.dailyTransactions),
  }
}

// last day exchange daily datas
export function getLastExchangeDailyDatas() {
  return getExchangeDailyDatasByDate(dateToLooksUnixTimestamp(new Date()))
}
