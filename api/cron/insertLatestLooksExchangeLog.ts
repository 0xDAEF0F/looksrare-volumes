import { SimpleIntervalJob, AsyncTask } from 'toad-scheduler'
import { PrismaClient } from '@prisma/client'
import {
  dateToLooksUnixTimestamp,
  looksUnixTimestampToDate,
} from 'api/utils/Date/dateConverter'
import getCollectionDailyDatas, {
  exchangeRealVolumeForDay,
} from 'api/utils/TheGraph/LooksRare/getCollectionDailyDatas'
import { getLastExchangeDailyDatas } from 'api/utils/TheGraph/LooksRare/getExchangeDailyDatasByDate.ts'

const prisma = new PrismaClient()

async function getTodayRealVolume() {
  const todayCollectionDatas = await getCollectionDailyDatas(
    dateToLooksUnixTimestamp(new Date())
  )
  return exchangeRealVolumeForDay(todayCollectionDatas)
}

const task = new AsyncTask(
  'Update DB for latest exchange information',
  async () => {
    const looksLogDay = await getLastExchangeDailyDatas()
    const realVolume = await getTodayRealVolume()
    const todayISOString = looksUnixTimestampToDate(Number(looksLogDay.date))

    const lastLooksLog = await prisma.exchangeLog.findFirst({
      where: { date: todayISOString },
    })

    // need to create dailyLog
    if (!lastLooksLog) {
      await prisma.exchangeLog.create({
        data: {
          date: todayISOString,
          dailyTransactions: looksLogDay.dailyTransactions,
          dailyUsers: looksLogDay.dailyUsers,
          dailyVolume: Number(looksLogDay.dailyVolume.toFixed(2)),
          dailyVolumeExcludingZeroFee: realVolume,
        },
      })
    }

    // update dailyLog
    if (lastLooksLog) {
      await prisma.exchangeLog.update({
        where: {
          date: lastLooksLog.date,
        },
        data: {
          date: todayISOString,
          dailyTransactions: looksLogDay.dailyTransactions,
          dailyUsers: looksLogDay.dailyUsers,
          dailyVolume: Number(looksLogDay.dailyVolume.toFixed(2)),
          dailyVolumeExcludingZeroFee: realVolume,
        },
      })
    }
  },
  (err: Error) => {
    console.log(err)
  }
)

export const job1 = new SimpleIntervalJob(
  { seconds: 15, runImmediately: true },
  task,
  'id_1'
)
