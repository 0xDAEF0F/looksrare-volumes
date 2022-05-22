import { PrismaClient } from '@prisma/client'
import {
  dateToLooksUnixTimestamp,
  looksUnixTimestampToDate,
} from 'api/utils/Date/dateConverter'
import getCollectionDailyDatas, {
  exchangeRealVolumeForDay,
} from 'api/utils/TheGraph/LooksRare/getCollectionDailyDatas'

const prisma = new PrismaClient()

export default async function seedDailyVolumeExcludingZeroFee() {
  // 1. How do I know all the days of the exchange
  const dbDates = await prisma.exchangeLog.findMany({
    select: {
      id: true,
      date: true,
    },
  })
  // 2. convert them to looksrare format
  const timestampsOfInterest = dbDates.map((dateObj) =>
    dateToLooksUnixTimestamp(new Date(dateObj.date))
  )
  // 3. get a map arr with key:date -- value:realVolume
  const mappingTimestampWithRealVolume = await Promise.all(
    timestampsOfInterest.map(async (date, i) => {
      const dayCollectionActivities = await getCollectionDailyDatas(date)
      const realVolume = exchangeRealVolumeForDay(dayCollectionActivities)
      return {
        id: dbDates[i].id,
        date: looksUnixTimestampToDate(date),
        dailyVolumeExcludingZeroFee: realVolume,
      }
    })
  )
  // 4. for each record and update the exchange model (need to implement bulk update)
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
