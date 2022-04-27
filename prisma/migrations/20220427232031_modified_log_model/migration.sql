/*
  Warnings:

  - Made the column `tokenSupply` on table `Exchange` required. This step will fail if there are existing NULL values in that column.
  - Made the column `tokenCap` on table `Exchange` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Exchange` MODIFY `tokenSupply` DOUBLE NOT NULL,
    MODIFY `tokenCap` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `ExchangeLog` ADD COLUMN `dailyVolumeExcludingZeroFee` VARCHAR(191) NULL,
    ADD COLUMN `price` INTEGER NULL;
