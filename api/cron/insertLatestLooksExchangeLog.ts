import { SimpleIntervalJob, AsyncTask } from 'toad-scheduler'
import { PrismaClient } from '@prisma/client'
import { getLastDayExchangeLog } from 'api/utils/TheGraph/LooksRare/getLastXLogs'
import { nowZeroedToDbFormat } from 'api/utils/Date/dateConverter'

const prisma = new PrismaClient()

const task = new AsyncTask(
  'Update DB for latest exchange information',
  async () => {
    const todayISOString = nowZeroedToDbFormat(new Date())
    const lastLooksLog = await prisma.exchangeLog.findFirst({
      where: { date: todayISOString },
    })

    const looksLogDay = await getLastDayExchangeLog()

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
              dailyVolume: Number(looksLogDay.dailyVolume).toFixed(2),
            },
            update: {
              date: todayISOString,
              dailyTransactions: looksLogDay.dailyTransactions,
              dailyUsers: looksLogDay.dailyUsers,
              dailyVolume: Number(looksLogDay.dailyVolume).toFixed(2),
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
  { seconds: 15, runImmediately: false },
  task,
  'id_1'
)
