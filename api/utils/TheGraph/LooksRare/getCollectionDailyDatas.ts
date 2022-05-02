import axios from 'axios'
import { roundDownUtcDate } from 'api/utils/Date/dateConverter'

type ExchangeDailyDataAxiosRes = {
  data: {
    collectionDailyDatas: {
      id: string
      date: string
      dailyVolume: string
      dailyVolumeExcludingZeroFee: string
      dailyTransactions: string
      collection: {
        totalVolume: string
        totalTransactions: string
        totalRoyaltyPaid: string
      }
    }[]
  }
}

const looksURL = 'https://api.thegraph.com/subgraphs/name/looksrare/exchange'

function dataConstructor(date: string) {
  return JSON.stringify({
    query: `query($date: BigInt!){
  collectionDailyDatas(
    orderBy: dailyVolume
    orderDirection: desc
    first: 1000
    where: {
    	date: $date 
    }
  ){
    id
    date
    dailyVolume
    dailyVolumeExcludingZeroFee
    dailyTransactions
    collection{
      totalVolume
      totalTransactions
      totalRoyaltyPaid
    }
  }
}`,
    variables: { date: date },
  })
}

export default async function getCollectionDailyDatas<T>(date: T) {
  const queryStr = dataConstructor(String(roundDownUtcDate(date)))
  const res = await axios.post<ExchangeDailyDataAxiosRes>(looksURL, queryStr)
  return res.data.data.collectionDailyDatas
}
