-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('Pending', 'Shipped', 'Delivered', 'Cancelled');

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'Pending';
