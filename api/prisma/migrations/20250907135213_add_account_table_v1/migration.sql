/*
  Warnings:

  - Added the required column `createdBy` to the `account_types` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `account_types` ADD COLUMN `createdBy` INTEGER NOT NULL;
