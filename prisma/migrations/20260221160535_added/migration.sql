/*
  Warnings:

  - Added the required column `login` to the `Trainer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Trainer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Review" ALTER COLUMN "rating" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Trainer" ADD COLUMN     "birth_date" TIMESTAMP(3),
ADD COLUMN     "code" INTEGER,
ADD COLUMN     "login" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL,
ALTER COLUMN "specialization" DROP NOT NULL,
ALTER COLUMN "experience_years" DROP NOT NULL,
ALTER COLUMN "count_work_day" DROP NOT NULL,
ALTER COLUMN "status" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "status" DROP NOT NULL;
