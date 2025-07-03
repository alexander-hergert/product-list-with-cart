import { FC } from "react";
import { PrismaClient } from "@prisma/client";
import { Product } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";

const prisma = new PrismaClient();

interface OrderProductsProps {
  orderId: string | undefined;
  productIds: string[] | undefined;
  productIdsQuantity: number[] | undefined;
}

const OrderProducts: FC<OrderProductsProps> = async ({
  orderId,
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
  //find feedbacks for the products in the order
  let feedbacks: { productId: string }[] = [];
  try {
    feedbacks = await prisma.feedbacks.findMany({
      where: {
        orderId: orderId,
        productId: { in: productIds },
      },
    });
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
  } finally {
    await prisma.$disconnect();
  }
  // Check if a product has feedback
  const hasFeedbackForProduct = (productId: string) =>
    feedbacks.some((f) => f.productId === productId);

  return (
    <div>
      {products.map((product) => {
        const hasFeedback = hasFeedbackForProduct(product.id);

        return (
          <div key={product.id}>
            <Link href={`/dashboard/products/${product.id}`}>
              <div
                className="border rounded-xl flex items-center justify-between 
                max-md:flex-col max-md:m-auto max-md:w-[327px] shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                <Image
                  className="md:rounded-l-xl max-md:w-full max-md:rounded-t-xl"
                  src={product.image}
                  alt={product.name}
                  width={250}
                  height={250}
                />
                <div className="m-auto max-md:m-0 max-md:my-4">
                  <h2 className="text-xl">{product.name}</h2>
                  {productIds && (
                    <p>
                      Quantity:{" "}
                      {productIdsQuantity?.[productIds.indexOf(product.id)]}
                    </p>
                  )}
                  <p>Price: ${product.price.toFixed(2)}</p>
                </div>
              </div>
            </Link>
            {hasFeedback && (
              <div className="rounded p-2 my-8 block m-auto border-4 w-1/3 text-center text-gray-300">
                Leave Feedback...
              </div>
            )}
            {!hasFeedback && (
              <Link href={`/dashboard/orders/${orderId}/${product.id}`}>
                <button className="border w-1/3 rounded p-2 my-8 hover:bg-black hover:text-white block m-auto">
                  Leave Feedback...
                </button>
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OrderProducts;
