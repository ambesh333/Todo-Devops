/*
  Warnings:

  - The values [Not_Staretd] on the enum `status_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "status_type_new" AS ENUM ('Not_Started', 'In_Progress', 'Completed');
ALTER TABLE "Todo" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Todo" ALTER COLUMN "status" TYPE "status_type_new" USING ("status"::text::"status_type_new");
ALTER TYPE "status_type" RENAME TO "status_type_old";
ALTER TYPE "status_type_new" RENAME TO "status_type";
DROP TYPE "status_type_old";
ALTER TABLE "Todo" ALTER COLUMN "status" SET DEFAULT 'Not_Started';
COMMIT;

-- AlterTable
ALTER TABLE "Todo" ALTER COLUMN "status" SET DEFAULT 'Not_Started';
