/*
  Warnings:

  - Added the required column `dailyTransactions` to the `ExchangeLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dailyUsers` to the `ExchangeLog` table without a default value. This is not possible if the table is not empty.
  - Made the column `date` on table `ExchangeLog` required. This step will fail if there are existing NULL values in that column.
  - Made the column `dailyVolume` on table `ExchangeLog` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `ExchangeLog` ADD COLUMN `dailyTransactions` VARCHAR(191) NOT NULL,
    ADD COLUMN `dailyUsers` VARCHAR(191) NOT NULL,
    MODIFY `date` VARCHAR(191) NOT NULL,
    MODIFY `dailyVolume` VARCHAR(191) NOT NULL;
