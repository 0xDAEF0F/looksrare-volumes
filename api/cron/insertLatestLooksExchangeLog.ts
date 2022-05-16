import { SimpleIntervalJob, AsyncTask } from 'toad-scheduler'
import { PrismaClient } from '@prisma/client'
import { getLastDayExchangeLog } from 'api/utils/TheGraph/LooksRare/getLastXLogs'
import { dateToLooksUnixTimestamp } from 'api/utils/Date/dateConverter'

const prisma = new PrismaClient()

const task = new AsyncTask(
  'Update DB for latest exchange information',
  async () => {
    const todayISOString = new Date(
      dateToLooksUnixTimestamp(new Date()) * 1000
    ).toISOString()
    const looksLogDay = await getLastDayExchangeLog()
    const lastLooksLog = await prisma.exchangeLog.findFirst({
      where: { date: todayISOString },
    })
    await prisma.exchange.update({
      where: {
        name: 'LooksRare',
      },
      data: {
        dailyLogs: {
          upsert: {
            where: {
              id: lastLooksLog?.id || '',
            },
            create: {
              date: todayISOString,
              dailyTransactions: looksLogDay.dailyTransactions,
              dailyUsers: looksLogDay.dailyUsers,
              dailyVolume: looksLogDay.dailyVolumeExcludingZeroFee,
            },
            update: {
              date: todayISOString,
              dailyTransactions: looksLogDay.dailyTransactions,
              dailyUsers: looksLogDay.dailyUsers,
              dailyVolume: looksLogDay.dailyVolumeExcludingZeroFee,
            },
          },
        },
      },
    })
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
