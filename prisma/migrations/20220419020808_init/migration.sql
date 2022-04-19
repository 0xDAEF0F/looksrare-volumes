-- CreateTable
CREATE TABLE `Exchange` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `ticker` VARCHAR(191) NOT NULL,
    `tokenSupply` INTEGER NULL,
    `tokenCap` INTEGER NULL,

    UNIQUE INDEX `Exchange_name_key`(`name`),
    UNIQUE INDEX `Exchange_ticker_key`(`ticker`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
