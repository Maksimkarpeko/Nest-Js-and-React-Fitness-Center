/*
  Warnings:

  - Added the required column `gender` to the `Trainer` table without a default value. This is not possible if the table is not empty.
  - Made the column `birth_date` on table `Trainer` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Trainer" ADD COLUMN     "gender" TEXT NOT NULL,
ALTER COLUMN "birth_date" SET NOT NULL;
