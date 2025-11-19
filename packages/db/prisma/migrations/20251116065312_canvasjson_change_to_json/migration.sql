/*
  Warnings:

  - Changed the type of `canvasJson` on the `Message` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."Message" DROP COLUMN "canvasJson",
ADD COLUMN     "canvasJson" JSONB NOT NULL;
