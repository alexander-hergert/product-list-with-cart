import SingleProduct from "@/components/products/SingleProduct";
import { Product } from "@/lib/types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getProducts = async (
  productName: string | undefined,
  mainCategory: string,
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
        ...(mainCategory && {
          main_category: { contains: mainCategory, mode: "insensitive" },
        }),
        ...(productCategory && {
          sub_category: { contains: productCategory, mode: "insensitive" },
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
  params,
}: {
  searchParams: SearchParams;
  params: { category: string };
}) => {
  const { productName, productCategory, minPrice, maxPrice, order } =
    searchParams;
  const { category } = params;
  const mainCategory = category.charAt(0).toUpperCase() + category.slice(1);

  const products = await getProducts(
    productName,
    mainCategory,
    productCategory,
    minPrice,
    maxPrice,
    order
  );
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold max-md:text-4xl max-md:my-4">
          {mainCategory}
        </h1>
        <h2 className="text-xl max-md:text-4xl max-md:my-4">
          {products.length} items<span className="max-md:hidden"> found</span>
        </h2>
      </div>
      <div className="grid grid-cols-3 gap-4 w-[800px] max-lg:w-[688px] max-md:w-[327px] max-md:grid-cols-1">
        {products.map((singleProduct: Product) => (
          <SingleProduct key={singleProduct.id} singleProduct={singleProduct} />
        ))}
      </div>
    </div>
  );
};

export default ProductsList;
