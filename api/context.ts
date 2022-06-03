import { PrismaClient } from '@prisma/client'
import { dateToLooksUnixTimestamp } from './utils/Date/dateConverter'
import getCollectionDailyDatas, {
  exchangeRealVolumeForDay,
} from './utils/TheGraph/LooksRare/getCollectionDailyDatas'

export type Context = {
  prisma: PrismaClient
}

const prisma = new PrismaClient()

export const context: Context = {
  prisma: prisma,
}

// getCollectionDailyDatas(dateToLooksUnixTimestamp(new Date())).then(res => {
//   console.log(exchangeRealVolumeForDay(res))
// })
