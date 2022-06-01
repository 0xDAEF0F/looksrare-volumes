import { PrismaClient } from '@prisma/client'
import { getCoinMarketCapData } from 'api/utils/CoinMarketCap/getCryptoData'

const prisma = new PrismaClient()

export default async function seedExchangeInfo() {
  const looksTokenInfo = await getCoinMarketCapData('17081')
  await prisma.exchange.create({
    data: {
      name: looksTokenInfo.name,
      ticker: looksTokenInfo.ticker,
      tokenAddress: looksTokenInfo.tokenAddress,
      tokenCap: looksTokenInfo.tokenCap,
      tokenSupply: looksTokenInfo.tokenSupply,
    },
  })
}
