-- AlterEnum
ALTER TYPE "OrderStatus" ADD VALUE 'Paid';

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "paymentId" TEXT NOT NULL DEFAULT '';
