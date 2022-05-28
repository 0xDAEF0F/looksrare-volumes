import { SimpleIntervalJob, AsyncTask } from 'toad-scheduler'
import { PrismaClient } from '@prisma/client'
import { getLastDayExchangeLog } from 'api/utils/TheGraph/LooksRare/getLastXLogs'
import {
  dateToLooksUnixTimestamp,
  looksUnixTimestampToDate,
} from 'api/utils/Date/dateConverter'
import getCollectionDailyDatas, {
  exchangeRealVolumeForDay,
} from 'api/utils/TheGraph/LooksRare/getCollectionDailyDatas'

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
    const looksLogDay = await getLastDayExchangeLog()
    const realVolume = await getTodayRealVolume()
    const todayISOString = looksUnixTimestampToDate(Number(looksLogDay.date))

    const lastLooksLog = await prisma.exchangeLog.findFirst({
      where: { date: todayISOString },
    })

    // need to create dailyLog
    if (!lastLooksLog) {
      await prisma.exchange.update({
        where: {
          ticker: 'LOOKS',
        },
        data: {
          dailyLogs: {
            create: {
              date: todayISOString,
              dailyTransactions: looksLogDay.dailyTransactions,
              dailyUsers: looksLogDay.dailyUsers,
              dailyVolume: Number(looksLogDay.dailyVolume).toFixed(2),
              dailyVolumeExcludingZeroFee: realVolume,
            },
          },
        },
      })
    }

    // update dailyLog
    if (lastLooksLog) {
      await prisma.exchange.update({
        where: {
          name: 'LooksRare',
        },
        data: {
          dailyLogs: {
            update: {
              where: {
                id: lastLooksLog?.id,
              },
              data: {
                date: todayISOString,
                dailyTransactions: looksLogDay.dailyTransactions,
                dailyUsers: looksLogDay.dailyUsers,
                dailyVolume: Number(looksLogDay.dailyVolume).toFixed(2),
                dailyVolumeExcludingZeroFee: realVolume,
              },
            },
          },
        },
      })
    }
  },
  (err: Error) => {
    console.log(err)
  }
)

export const job1 = new SimpleIntervalJob(
  { seconds: 15, runImmediately: false },
  task,
  'id_1'
)
