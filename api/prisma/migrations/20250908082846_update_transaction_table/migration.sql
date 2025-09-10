-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_transactionTypeId_fkey` FOREIGN KEY (`transactionTypeId`) REFERENCES `transaction_types`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
