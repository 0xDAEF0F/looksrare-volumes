import { PrismaClient } from '@prisma/client'
import seedExchangeDailyDatas from './scripts/seedExchDailyDatas'
import seedExchangeInfo from './scripts/seedExchInfo'

const prisma = new PrismaClient()

async function main() {
  await seedExchangeInfo()
  await seedExchangeDailyDatas()
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
