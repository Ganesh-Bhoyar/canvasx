-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "requests" TEXT[] DEFAULT ARRAY[]::TEXT[];
