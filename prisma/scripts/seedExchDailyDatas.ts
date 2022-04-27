import { PrismaClient } from '@prisma/client'
import { getAllLooksLogs } from 'api/utils/TheGraph/LooksRare/getLast1000Logs'

const prisma = new PrismaClient()

export default async function seedExchangeDailyDatas() {
  // call getExchDailyDatas
  const rawLogs = await getAllLooksLogs()
  // need to modify dates to what our db understands.
  const exchangeLogs = rawLogs.map((x) => {
    return {
      date: new Date(Number(x.date) * 1000).toISOString(),
      dailyVolume: x.dailyVolume,
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
