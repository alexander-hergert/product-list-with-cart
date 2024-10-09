import { FC } from "react";
import { PrismaClient } from "@prisma/client";
import { Product } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

const prisma = new PrismaClient();

interface OrderProductsProps {
  productIds: string[] | undefined;
  productIdsQuantity: number[] | undefined;
}

const OrderProducts: FC<OrderProductsProps> = async ({
  productIds,
  productIdsQuantity,
}) => {
  let products: Product[] = [];
  try {
    products = await prisma.products.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
  } finally {
    await prisma.$disconnect();
  }

  return (
    <div>
      {products.map((product) => (
        <Link key={product.id} href={`/dashboard/products/${product.id}`}>
          <div key={product.id} className="border">
            <h3>{product.name}</h3>
            <Image
              src={product.image}
              alt={product.name}
              width={100}
              height={100}
            />
            {productIds && (
              <p>
                Quantity: {productIdsQuantity?.[productIds.indexOf(product.id)]}
              </p>
            )}
            <p>Price: ${product.price.toFixed(2)}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default OrderProducts;
