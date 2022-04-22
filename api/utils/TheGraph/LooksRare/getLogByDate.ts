import to from 'await-to-js'
import axios from 'axios'

export type DailyDatasAxiosRes = {
  data: {
    exchangeDailyDatas: {
      id: string
      date: string
      dailyUsers: string
      dailyVolumeExcludingZeroFee: string
      dailyVolume: string
      dailyTransactions: string
    }[]
  }
}
export type DailyDatas = Awaited<ReturnType<typeof getLooksLogsByDate>>

// need foolproof way of passing date to accomodate LooksRare API
export async function getLooksLogsByDate(date: number) {
  const data = JSON.stringify({
    query: `{
      exchangeDailyDatas(where: { date: ${date} }) {
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

  return res.data.data.exchangeDailyDatas[0]
}
