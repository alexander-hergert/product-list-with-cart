import SingleProduct from "@/components/products/SingleProduct";
import { Product } from "@/lib/types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getProducts = async (): Promise<Product[]> => {
  try {
    const products: Product[] = await prisma.products.findMany();
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
    <div>
      {products.map((singleProduct: Product) => (
        <SingleProduct key={singleProduct.id} />
      ))}
    </div>
  );
};

export default ProductsList;
