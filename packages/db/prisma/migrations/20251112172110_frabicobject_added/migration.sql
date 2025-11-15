/*
  Warnings:

  - You are about to drop the column `color` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `height` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `shape` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `width` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `x` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `y` on the `Message` table. All the data in the column will be lost.
  - Added the required column `canvasJson` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `desc` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Message" DROP COLUMN "color",
DROP COLUMN "height",
DROP COLUMN "shape",
DROP COLUMN "time",
DROP COLUMN "width",
DROP COLUMN "x",
DROP COLUMN "y",
ADD COLUMN     "canvasJson" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."Room" ADD COLUMN     "desc" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "avatar" TEXT;
