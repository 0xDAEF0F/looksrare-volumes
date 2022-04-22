import { roundDownUtcDate } from 'api/utils/Date/dateConverter'
import to from 'await-to-js'
import axios from 'axios'
import { DailyDatasAxiosRes } from './getLogByDate'

export async function getAllLooksLogs() {
  const data = JSON.stringify({
    query: `{
    exchangeDailyDatas(orderDirection: desc,
      orderBy: date, 
      first: 1000,
      where: {date_lte: ${roundDownUtcDate(Date.now())}}) {
      id
      date
      dailyUsers
      dailyVolumeExcludingZeroFee
      dailyVolume
      dailyTransactions
    }
  }`,
  })

  const [err, res] = await to(
    axios.post<DailyDatasAxiosRes>(
      'https://api.thegraph.com/subgraphs/name/looksrare/exchange',
      data
    )
  )
  if (err) throw new Error('API error.')

  return res.data.data.exchangeDailyDatas
}
