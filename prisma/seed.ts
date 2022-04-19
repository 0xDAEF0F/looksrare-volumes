import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const looksRare = await prisma.exchange.createMany({
    data: [
      { name: 'looksRare', ticker: 'LOOKS' },
      { name: 'X2Y2', ticker: 'X2Y2' },
    ],
  });
  console.log(looksRare);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
