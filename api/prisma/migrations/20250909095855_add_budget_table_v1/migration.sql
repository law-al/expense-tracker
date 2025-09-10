/*
  Warnings:

  - You are about to drop the column `endDate` on the `budgets` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `budgets` table. All the data in the column will be lost.
  - Added the required column `period` to the `budgets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `budgets` DROP COLUMN `endDate`,
    DROP COLUMN `startDate`,
    ADD COLUMN `period` VARCHAR(191) NOT NULL;
