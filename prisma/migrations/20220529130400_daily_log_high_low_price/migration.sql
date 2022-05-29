/*
  Warnings:

  - You are about to drop the column `price` on the `ExchangeLog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `ExchangeLog` DROP COLUMN `price`,
    ADD COLUMN `priceHigh` DOUBLE NULL,
    ADD COLUMN `priceLow` DOUBLE NULL;
