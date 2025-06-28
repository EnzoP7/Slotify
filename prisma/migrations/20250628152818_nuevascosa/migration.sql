/*
  Warnings:

  - Added the required column `slotDuration` to the `BusinessSchedule` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BusinessSchedule" DROP CONSTRAINT "BusinessSchedule_businessId_fkey";

-- AlterTable
ALTER TABLE "BusinessSchedule" ADD COLUMN     "slotDuration" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "BusinessSchedule" ADD CONSTRAINT "BusinessSchedule_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
