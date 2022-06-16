import { PrismaClient } from '@prisma/client'
import { dateToLooksUnixTimestamp } from 'api/utils/Date/dateConverter'
import { getExchangeDailyDatasByDate } from './getExchangeDailyDatasByDate'
import to from 'await-to-js'

const prisma = new PrismaClient()

export default async function updateRawVolumes() {
  // 1. Find all date db records
  const dbDates = await prisma.exchangeLog.findMany({
    select: {
      date: true,
    },
  })
  // 2. Loop over each date and update db with raw volume
  dbDates.forEach(async ({ date }) => {
    // query datas for this date
    const [error, dailyActivity] = await to(
      getExchangeDailyDatasByDate(dateToLooksUnixTimestamp(new Date(date)))
    )
    if (error) {
      console.error(error, date)
      return
    }
    await prisma.exchangeLog.update({
      where: { date: date },
      data: {
        dailyTransactions: dailyActivity.dailyTransactions,
        dailyUsers: dailyActivity.dailyUsers,
        dailyVolume: dailyActivity.dailyVolume,
      },
    })
  })
}
