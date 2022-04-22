import to from 'await-to-js'
import axios from 'axios'

export type DailyDatasRes = {
  data: {
    exchangeDailyDatas: {
      date: string
      dailyUsers: string
      dailyVolume: string
      dailyTransactions: string
    }[]
  }
}
export type DailyDatas = Awaited<ReturnType<typeof getLooksExchangeDailyDatas>>

// need foolproof way of passing date to accomodate LooksRare API
export async function getLooksExchangeDailyDatas(date: string) {
  const data = JSON.stringify({
    query: `{
      exchangeDailyDatas(where: { date: ${date} }) {
        date
        dailyUsers
        dailyVolume
        dailyTransactions
      }
    }`,
    variables: {},
  })

  const [err, res] = await to(
    axios.post<DailyDatasRes>(
      'https://api.thegraph.com/subgraphs/name/looksrare/exchange',
      data
    )
  )
  if (err) throw new Error('API error.')

  return res.data.data.exchangeDailyDatas[0]
}
