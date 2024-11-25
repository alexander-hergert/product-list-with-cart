import SingleProduct from "@/components/products/SingleProduct";
import { Product } from "@/lib/types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getProducts = async (
  productName: string | undefined,
  productCategory: string | undefined,
  minPrice: string | undefined,
  maxPrice: string | undefined,
  order: string | undefined
): Promise<Product[]> => {
  try {
    const products: Product[] = await prisma.products.findMany({
      where: {
        ...(productName && {
          name: { contains: productName, mode: "insensitive" },
        }),
        ...(productCategory && {
          category: { contains: productCategory, mode: "insensitive" },
        }),
        price: {
          ...(minPrice && { gte: Number(minPrice) }),
          ...(maxPrice && { lte: Number(maxPrice) }),
        },
      },
      orderBy: {
        ...((order === "productnameAsc" && { name: "asc" }) ||
          (order === "productnameDesc" && { name: "desc" })),
        ...((order === "priceAsc" && { price: "asc" }) ||
          (order === "priceDesc" && { price: "desc" })),
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

type SearchParams = {
  productName?: string;
  productCategory?: string;
  minPrice?: string;
  maxPrice?: string;
  order?: string;
};

const ProductsList = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}) => {
  const { productName, productCategory, minPrice, maxPrice, order } =
    searchParams;

  const products = await getProducts(
    productName,
    productCategory,
    minPrice,
    maxPrice,
    order
  );
  return (
    <div className="grid grid-cols-3 gap-4 border w-[800px]">
      {products.map((singleProduct: Product) => (
        <SingleProduct key={singleProduct.id} singleProduct={singleProduct} />
      ))}
    </div>
  );
};

export default ProductsList;
