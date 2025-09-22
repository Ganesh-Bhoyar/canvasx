/*
  Warnings:

  - You are about to drop the column `roomId` on the `Message` table. All the data in the column will be lost.
  - Added the required column `slugid` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Message" DROP CONSTRAINT "Message_roomId_fkey";

-- AlterTable
ALTER TABLE "public"."Message" DROP COLUMN "roomId",
ADD COLUMN     "slugid" TEXT NOT NULL,
ADD COLUMN     "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_slugid_fkey" FOREIGN KEY ("slugid") REFERENCES "public"."Room"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;
