/*
  Warnings:

  - A unique constraint covering the columns `[date]` on the table `ExchangeLog` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `ExchangeLog_date_key` ON `ExchangeLog`(`date`);
