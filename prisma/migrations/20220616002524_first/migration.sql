-- CreateTable
CREATE TABLE "Exchange" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ticker" TEXT NOT NULL,
    "tokenAddress" TEXT NOT NULL,
    "tokenSupply" DOUBLE PRECISION NOT NULL,
    "tokenCap" INTEGER NOT NULL,

    CONSTRAINT "Exchange_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExchangeLog" (
    "date" TEXT NOT NULL,
    "dailyVolume" DOUBLE PRECISION NOT NULL,
    "dailyVolumeExcludingZeroFee" DOUBLE PRECISION,
    "dailyUsers" INTEGER NOT NULL,
    "dailyTransactions" INTEGER NOT NULL,
    "priceHigh" DOUBLE PRECISION,
    "priceLow" DOUBLE PRECISION,
    "ethPriceHigh" DOUBLE PRECISION,
    "ethPriceLow" DOUBLE PRECISION,

    CONSTRAINT "ExchangeLog_pkey" PRIMARY KEY ("date")
);

-- CreateIndex
CREATE UNIQUE INDEX "Exchange_name_key" ON "Exchange"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Exchange_ticker_key" ON "Exchange"("ticker");

-- CreateIndex
CREATE UNIQUE INDEX "Exchange_tokenAddress_key" ON "Exchange"("tokenAddress");

-- CreateIndex
CREATE UNIQUE INDEX "ExchangeLog_date_key" ON "ExchangeLog"("date");
