import { PrismaClient } from '@prisma/client';
import { getCoinMarketCapData } from '../api/utils/CoinMarketCap/getCryptoData';
const prisma = new PrismaClient();

const coinMarketCapTokensMapping = {
  looksRare: '17081',
  x2y2: '18106',
};

const tokenObjectsPromise = Object.values(coinMarketCapTokensMapping).map((id) => {
  return getCoinMarketCapData(id);
});

async function main() {
  const exchangesToSeed = await Promise.all(tokenObjectsPromise);
  exchangesToSeed.forEach(async (e) => {
    await prisma.exchange.create({
      data: {
        name: e.name,
        ticker: e.ticker,
        tokenAddress: e.tokenAddress,
        tokenCap: e.tokenCap,
      },
    });
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
