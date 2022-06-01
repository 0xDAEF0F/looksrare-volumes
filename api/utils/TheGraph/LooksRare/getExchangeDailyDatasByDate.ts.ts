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

  // return exchangeDailyDatas[0]
  return {
    ...exchangeDailyDatas[0],
    dailyUsers: Number(exchangeDailyDatas[0].dailyUsers),
    dailyVolume: Number(exchangeDailyDatas[0].dailyVolume),
    dailyTransactions: Number(exchangeDailyDatas[0].dailyTransactions),
  }
}

// last day exchange daily datas
export function getLastExchangeDailyDatas() {
  return getExchangeDailyDatasByDate(dateToLooksUnixTimestamp(new Date()))
}
