/*
  Warnings:

  - You are about to alter the column `updated_at` on the `user` table. The data in that column could be lost. The data in that column will be cast from `DateTime(3)` to `DateTime`.
  - You are about to alter the column `deleted_at` on the `user` table. The data in that column could be lost. The data in that column will be cast from `DateTime(3)` to `DateTime`.
  - You are about to alter the column `waktu` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `updated_at` DATETIME NULL,
    MODIFY `deleted_at` DATETIME NULL,
    MODIFY `waktu` VARCHAR(100) NULL;
