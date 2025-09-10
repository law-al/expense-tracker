/*
  Warnings:

  - A unique constraint covering the columns `[userId,categoryId,startDate]` on the table `budgets` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `budgets_userId_categoryId_startDate_key` ON `budgets`(`userId`, `categoryId`, `startDate`);
