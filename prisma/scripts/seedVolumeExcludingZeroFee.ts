import { PrismaClient } from '@prisma/client'
import { dateToLooksUnixTimestamp } from 'api/utils/Date/dateConverter'
import getCollectionDailyDatas from 'api/utils/TheGraph/LooksRare/getCollectionDailyDatas'

const prisma = new PrismaClient()

type DailyCollectionActivity = Awaited<ReturnType<typeof getCollectionDailyDatas>>

export function getRealVolumeForADay(d: DailyCollectionActivity) {
  return d.reduce((acc, curr) => {
    if (Number(curr.collection.totalRoyaltyPaid) === 0) return acc
    return acc + Number(curr.dailyVolume)
  }, 0)
}

export default async function seedDailyVolumeExcludingZeroFee() {
  // 1. How do I know all the days of the exchange
  const dbDates = await prisma.exchangeLog.findMany({
    select: {
      id: true,
      date: true,
    },
  })
  // 2. Parse them to query subgraph in it's format
  const timestampsToQueryLooksFormat = dbDates.map((dateObj) =>
    dateToLooksUnixTimestamp(new Date(dateObj.date))
  )
  // 3. get a map arr with key:date -- value:realVolume
  const mappingTimestampWithRealVolume = await Promise.all(
    timestampsToQueryLooksFormat.map(async (date, i) => {
      const eachDayCollectionActivity = await getCollectionDailyDatas(date)
      const realVolume = getRealVolumeForADay(eachDayCollectionActivity)
      return {
        id: dbDates[i].id,
        date: new Date(date * 1000).toUTCString(),
        dailyVolumeExcludingZeroFee: realVolume,
      }
    })
  )
  // 4. for each guy go and update the model
  mappingTimestampWithRealVolume.map(async (operation) => {
    return await prisma.exchange.update({
      where: { ticker: 'LOOKS' },
      data: {
        dailyLogs: {
          update: {
            where: {
              id: operation.id,
            },
            data: {
              dailyVolumeExcludingZeroFee: operation.dailyVolumeExcludingZeroFee,
            },
          },
        },
      },
    })
  })
}
