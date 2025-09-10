-- DropForeignKey
ALTER TABLE `transactions` DROP FOREIGN KEY `transactions_categoryId_fkey`;

-- DropIndex
DROP INDEX `transactions_categoryId_fkey` ON `transactions`;

-- AlterTable
ALTER TABLE `transactions` MODIFY `categoryId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
