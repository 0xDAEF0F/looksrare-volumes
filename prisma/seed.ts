import { PrismaClient } from '@prisma/client'
import seedExchangeDailyDatas from './scripts/seedExchDailyDatas'
import seedExchangeInfo from './scripts/seedExchInfo'
import seedDailyVolumeExcludingZeroFee from './scripts/seedVolumeExcludingZeroFee'

const prisma = new PrismaClient()

async function main() {
  await seedExchangeInfo()
  await seedExchangeDailyDatas()
  await seedDailyVolumeExcludingZeroFee()
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
