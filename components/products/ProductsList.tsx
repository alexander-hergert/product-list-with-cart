import SingleProduct from "@/components/products/SingleProduct";
import { Product } from "@/lib/types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getProducts = async (): Promise<Product[]> => {
  try {
    const products: Product[] = await prisma.products.findMany({
      orderBy: {
        id: "asc",
      },
    });
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  } finally {
    await prisma.$disconnect();
  }
};

const ProductsList = async () => {
  const products = await getProducts();
  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map((singleProduct: Product) => (
        <SingleProduct key={singleProduct.id} singleProduct={singleProduct} />
      ))}
    </div>
  );
};

export default ProductsList;
