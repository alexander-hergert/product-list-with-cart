-- AlterTable
ALTER TABLE "feedbacks" ADD COLUMN     "orderId" TEXT NOT NULL DEFAULT '';

-- AddForeignKey
ALTER TABLE "feedbacks" ADD CONSTRAINT "feedbacks_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
