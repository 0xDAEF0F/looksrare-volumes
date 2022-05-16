import axios from 'axios'

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

function dataConstructor(date: number) {
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

export default async function getCollectionDailyDatas(looksTimestamp: number) {
  const queryStr = dataConstructor(looksTimestamp)
  const res = await axios.post<ExchangeDailyDataAxiosRes>(looksURL, queryStr)
  return res.data.data.collectionDailyDatas
}
