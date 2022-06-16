import { SimpleIntervalJob, AsyncTask } from 'toad-scheduler'
import { PrismaClient } from '@prisma/client'
import { dateToISOStringUTCTime } from 'api/utils/Date/dateConverter'
import { getLastExchangeDailyDatas } from 'api/utils/TheGraph/LooksRare/getExchangeDailyDatasByDate'
import updateRealVolumes from 'api/utils/TheGraph/LooksRare/updateRealVolumes'
import { updateEthPrices } from 'api/utils/CoinAPI/ethereum'
import { updateDbPrices } from 'api/utils/CoinAPI'
import updateRawVolumes from 'api/utils/TheGraph/LooksRare/updateRawVolumes'

const prisma = new PrismaClient()

const task = new AsyncTask(
  'update exchange log model with latest real volumes',
  async () => {
    const today = dateToISOStringUTCTime(new Date())
    // check if we have that day in db
    const lastLooksLog = await prisma.exchangeLog.findFirst({
      where: { date: today },
    })

    // safe to update the prices and real volumes
    if (lastLooksLog) {
      await updateRawVolumes()
      await updateRealVolumes()
      await updateDbPrices()
      await updateEthPrices()
    }

    // need to create first and then update
    if (!lastLooksLog) {
      const exchangeDailyDatas = await getLastExchangeDailyDatas()
      await prisma.exchangeLog.create({
        data: {
          date: today,
          dailyTransactions: exchangeDailyDatas.dailyTransactions,
          dailyUsers: exchangeDailyDatas.dailyUsers,
          dailyVolume: exchangeDailyDatas.dailyVolume,
        },
      })
    }
  },
  (err: Error) => {
    console.log(err)
  }
)

export const job1 = new SimpleIntervalJob(
  { seconds: 60 * 60, runImmediately: false },
  task,
  'id_1'
)
