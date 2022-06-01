/*
  Warnings:

  - You are about to alter the column `dailyVolume` on the `ExchangeLog` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.
  - You are about to alter the column `dailyTransactions` on the `ExchangeLog` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `dailyUsers` on the `ExchangeLog` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `ExchangeLog` MODIFY `dailyVolume` DOUBLE NOT NULL,
    MODIFY `dailyTransactions` INTEGER NOT NULL,
    MODIFY `dailyUsers` INTEGER NOT NULL;
