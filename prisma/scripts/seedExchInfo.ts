import { PrismaClient } from '@prisma/client'
import { getCoinMarketCapData } from 'api/utils/CoinMarketCap/getCryptoData'

const prisma = new PrismaClient()

const coinMarketCapTokensMapping = {
  looksRare: '17081',
}

const tokenObjectsPromise = Object.values(coinMarketCapTokensMapping).map((id) => {
  return getCoinMarketCapData(id)
})

export default async function seedExchangeInfo() {
  const exchangesToSeed = await Promise.all(tokenObjectsPromise)
  const exchanges = exchangesToSeed.map((e) => {
    return {
      name: e.name,
      ticker: e.ticker,
      tokenAddress: e.tokenAddress,
      tokenSupply: e.tokenSupply,
      tokenCap: e.tokenCap,
    }
  })
  return await prisma.exchange.createMany({
    data: exchanges,
  })
}
