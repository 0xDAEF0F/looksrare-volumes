import { PrismaClient } from '@prisma/client'
import { looksUnixTimestampToDate } from 'api/utils/Date/dateConverter'
import { getAllLooksLogs } from 'api/utils/TheGraph/LooksRare/getLast1000Logs'

const prisma = new PrismaClient()

export default async function seedExchangeDailyDatas() {
  // call getExchDailyDatas
  const rawLogs = await getAllLooksLogs()
  // need to modify dates to what our db understands.
  const exchangeLogs = rawLogs.map((x) => {
    return {
      date: looksUnixTimestampToDate(Number(x.date)),
      dailyVolume: Number(x.dailyVolume).toFixed(2),
      dailyUsers: x.dailyUsers,
      dailyTransactions: x.dailyTransactions,
    }
  })
  return await prisma.exchange.update({
    where: {
      name: 'LooksRare',
    },
    data: {
      dailyLogs: {
        createMany: {
          data: exchangeLogs,
        },
      },
    },
  })
}
