/*
  Warnings:

  - Made the column `categoryId` on table `transactions` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `transactions` DROP FOREIGN KEY `transactions_categoryId_fkey`;

-- DropIndex
DROP INDEX `transactions_categoryId_fkey` ON `transactions`;

-- AlterTable
ALTER TABLE `transactions` MODIFY `categoryId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
