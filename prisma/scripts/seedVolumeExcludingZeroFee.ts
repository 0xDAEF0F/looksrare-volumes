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
      date: true,
    },
  })
  // 2. convert them to looksrare format
  const timestampsOfInterest = dbDates.map((dateObj) =>
    dateToLooksUnixTimestamp(new Date(dateObj.date))
  )
  // 3. get a map arr with key:date -- value:realVolume
  const mappingTimestampWithRealVolume = await Promise.all(
    timestampsOfInterest.map(async (date) => {
      const dayCollectionActivities = await getCollectionDailyDatas(date)
      const realVolume = exchangeRealVolumeForDay(dayCollectionActivities)
      return {
        date: looksUnixTimestampToDate(date),
        dailyVolumeExcludingZeroFee: realVolume,
      }
    })
  )
  // 4. for each record and update the exchange model (need to implement bulk update)
  mappingTimestampWithRealVolume.forEach(async (operation) => {
    await prisma.exchangeLog
      .update({
        where: { date: operation.date },
        data: {
          dailyVolumeExcludingZeroFee: operation.dailyVolumeExcludingZeroFee,
        },
      })
      .catch((e) => console.log(e))
  })
}
