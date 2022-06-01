/*
  Warnings:

  - The primary key for the `ExchangeLog` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `exchangeId` on the `ExchangeLog` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `ExchangeLog` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `ExchangeLog` DROP FOREIGN KEY `ExchangeLog_exchangeId_fkey`;

-- AlterTable
ALTER TABLE `ExchangeLog` DROP PRIMARY KEY,
    DROP COLUMN `exchangeId`,
    DROP COLUMN `id`,
    ADD PRIMARY KEY (`date`);
