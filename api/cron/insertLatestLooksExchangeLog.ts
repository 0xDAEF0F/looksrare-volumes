import { SimpleIntervalJob, AsyncTask } from 'toad-scheduler'
import { PrismaClient } from '@prisma/client'
import { getLastDayExchangeLog } from 'api/utils/TheGraph/LooksRare/getLastXLogs'

const prisma = new PrismaClient()

const task = new AsyncTask(
  'Update DB for latest exchange information',
  async () => {
    const looksLogDay = await getLastDayExchangeLog()
    const lastLooksLog = await prisma.exchangeLog.findFirst({
      where: { date: '2022-04-23' },
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
              date: '2022-04-23',
              dailyTransactions: looksLogDay.dailyTransactions,
              dailyUsers: looksLogDay.dailyUsers,
              dailyVolume: looksLogDay.dailyVolumeExcludingZeroFee,
            },
            update: {
              date: '2022-04-23',
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
  { seconds: 60, runImmediately: true },
  task,
  'id_1'
)
