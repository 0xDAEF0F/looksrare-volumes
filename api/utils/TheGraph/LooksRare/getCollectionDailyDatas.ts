import { request, gql } from 'graphql-request'

type CollectionDailyDatasResponse = {
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
type CollectionDailyData = CollectionDailyDatasResponse['collectionDailyDatas'][number]

const url = process.env.LOOKSRARE_SUBGRAPH_URL as string
const gqlQuery = gql`
  query ($date: BigInt!) {
    collectionDailyDatas(
      orderBy: dailyVolume
      orderDirection: desc
      first: 1000
      where: { date: $date }
    ) {
      date
      dailyVolume
      collection {
        totalRoyaltyPaid
      }
    }
  }
`

export default async function getCollectionDailyDatas(looksTimestamp: number) {
  return (
    await request(url, gqlQuery, {
      date: looksTimestamp,
    })
  ).collectionDailyDatas as CollectionDailyDatasResponse['collectionDailyDatas']
}

export function exchangeRealVolumeForDay(
  dayActivity: CollectionDailyDatasResponse['collectionDailyDatas']
) {
  return Number(
    dayActivity
      .reduce((acc, curr) => {
        return filterCollectionRealVolume(curr) + acc
      }, 0)
      .toFixed(2)
  )
}

function filterCollectionRealVolume(collection: CollectionDailyData) {
  const isRoyaltyAboveZero = Number(collection.collection.totalRoyaltyPaid) > 0

  if (isRoyaltyAboveZero) return Number(collection.dailyVolume)

  return 0
}
