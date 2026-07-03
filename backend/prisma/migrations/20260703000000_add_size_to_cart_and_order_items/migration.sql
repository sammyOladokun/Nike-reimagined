-- AlterTable
ALTER TABLE "CartItem" ADD COLUMN     "size" TEXT NOT NULL DEFAULT 'UK 9';

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "size" TEXT NOT NULL DEFAULT 'UK 9';

-- DropIndex
DROP INDEX "CartItem_cartId_productId_key";

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_cartId_productId_size_key" ON "CartItem"("cartId", "productId", "size");
