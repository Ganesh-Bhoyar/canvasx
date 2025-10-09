/*
  Warnings:

  - You are about to drop the column `content` on the `Message` table. All the data in the column will be lost.
  - Added the required column `color` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `height` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shape` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `width` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `x` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `y` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Message" DROP COLUMN "content",
ADD COLUMN     "color" TEXT NOT NULL,
ADD COLUMN     "height" INTEGER NOT NULL,
ADD COLUMN     "shape" TEXT NOT NULL,
ADD COLUMN     "width" INTEGER NOT NULL,
ADD COLUMN     "x" INTEGER NOT NULL,
ADD COLUMN     "y" INTEGER NOT NULL;
