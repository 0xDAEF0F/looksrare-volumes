import { PrismaClient } from '@prisma/client'
import { dateToLooksUnixTimestamp } from 'api/utils/Date/dateConverter'
import getCollectionDailyDatas, {
  exchangeRealVolumeForDay,
} from 'api/utils/TheGraph/LooksRare/getCollectionDailyDatas'
import to from 'await-to-js'

const prisma = new PrismaClient()

export default async function updateRealVolumes() {
  // 1. Find all date db records
  const dbDates = await prisma.exchangeLog.findMany({
    select: {
      date: true,
    },
  })
  // 2. Loop over each date and update db with real volume
  dbDates.forEach(async ({ date }) => {
    // query volume for this date
    const [error, dailyActivity] = await to(
      getCollectionDailyDatas(dateToLooksUnixTimestamp(new Date(date)))
    )
    if (error) {
      console.error(error, date)
      return
    }
    // retrieve real volume and update the db
    const realVolume = exchangeRealVolumeForDay(dailyActivity)
    await prisma.exchangeLog.update({
      where: { date: date },
      data: { dailyVolumeExcludingZeroFee: realVolume },
    })
  })
}
