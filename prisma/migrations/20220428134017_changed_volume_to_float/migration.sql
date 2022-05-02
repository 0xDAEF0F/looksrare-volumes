/*
  Warnings:

  - You are about to alter the column `dailyVolumeExcludingZeroFee` on the `ExchangeLog` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.

*/
-- AlterTable
ALTER TABLE `ExchangeLog` MODIFY `dailyVolumeExcludingZeroFee` DOUBLE NULL;
