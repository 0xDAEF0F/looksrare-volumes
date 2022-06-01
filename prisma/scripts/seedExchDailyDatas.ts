import { PrismaClient } from '@prisma/client'
import { looksUnixTimestampToDate } from 'api/utils/Date/dateConverter'
import { getLast1000ExchangeDailyDatas } from 'api/utils/TheGraph/LooksRare/getAllExchangeDailyDatas'

const prisma = new PrismaClient()

export default async function seedExchangeDailyDatas() {
  // call getExchDailyDatas
  const rawLogs = await getLast1000ExchangeDailyDatas()
  // need to modify dates to what our db understands.
  const exchangeLogs = rawLogs.map((x) => {
    return {
      date: looksUnixTimestampToDate(Number(x.date)),
      dailyVolume: Number(Number(x.dailyVolume).toFixed(2)),
      dailyUsers: Number(x.dailyUsers),
      dailyTransactions: Number(x.dailyTransactions),
    }
  })
  return await prisma.exchangeLog.createMany({ data: exchangeLogs })
}
