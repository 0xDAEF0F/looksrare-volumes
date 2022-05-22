import { request, gql } from 'graphql-request'

type ExchangeDailyDatas = {
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

type CollectionDailyDatas = ExchangeDailyDatas['collectionDailyDatas'][number]

const looksURL = 'https://api.thegraph.com/subgraphs/name/looksrare/exchange'

const gqlQuery = gql`
  query ($date: BigInt!) {
    collectionDailyDatas(
      orderBy: dailyVolume
      orderDirection: desc
      first: 1000
      where: { date: $date }
    ) {
      id
      date
      dailyVolume
      dailyVolumeExcludingZeroFee
      dailyTransactions
      collection {
        totalVolume
        totalTransactions
        totalRoyaltyPaid
      }
    }
  }
`

export default async function getCollectionDailyDatas(looksTimestamp: number) {
  return (
    await request(looksURL, gqlQuery, {
      date: looksTimestamp,
    })
  ).collectionDailyDatas as ExchangeDailyDatas['collectionDailyDatas']
}

function collectionRealVolumeForDay(collection: CollectionDailyDatas) {
  const isRoyaltyAboveZero = Number(collection.collection.totalRoyaltyPaid) > 0

  if (isRoyaltyAboveZero) return Number(collection.dailyVolume)

  return 0
}

export function exchangeRealVolumeForDay(
  dayActivity: Awaited<ReturnType<typeof getCollectionDailyDatas>>
) {
  const realVolume = dayActivity.reduce((acc, curr) => {
    const realVolume = collectionRealVolumeForDay(curr)

    if (realVolume > 0) return realVolume + acc

    return acc
  }, 0)

  return Number(realVolume.toFixed(2))
}
