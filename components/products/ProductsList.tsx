import SingleProduct from "@/components/products/SingleProduct";
import { Product } from "@/lib/types";
import { PrismaClient } from "@prisma/client";
import ProductPagination from "@/components/products/ProductPagination";

const prisma = new PrismaClient();

const getProducts = async (
  productId: string | undefined,
  productName: string | undefined,
  mainCategory: string,
  productCategory: string | undefined,
  minPrice: string | undefined,
  maxPrice: string | undefined,
  page: number | undefined,
  order: string | undefined
): Promise<Product[]> => {
  try {
    const products: Product[] = await prisma.products.findMany({
      where: {
        ...(productId && {
          id: { contains: productId, mode: "insensitive" },
        }),
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
        ...((order === "productCategoryAsc" && { sub_category: "asc" }) ||
          (order === "productCategoryDesc" && { sub_category: "desc" })),
        ...((order === "priceAsc" && { price: "asc" }) ||
          (order === "priceDesc" && { price: "desc" })),
      },
      skip: ((page || 1) - 1) * 9, //optional depending on page number,
      take: 9, //fix value pagesize
    });
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  } finally {
    await prisma.$disconnect();
  }
};

const countProducts = async (
  productId: string | undefined,
  productName: string | undefined,
  mainCategory: string,
  productCategory: string | undefined,
  minPrice: string | undefined,
  maxPrice: string | undefined
): Promise<number> => {
  try {
    const total = await prisma.products.count({
      where: {
        ...(productId && { id: { contains: productId, mode: "insensitive" } }),
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
    });
    return total;
  } catch (error) {
    console.error("Error counting products:", error);
    return 0;
  } finally {
    await prisma.$disconnect();
  }
};

type SearchParams = {
  productId?: string;
  productName?: string;
  productCategory?: string;
  minPrice?: string;
  maxPrice?: string;
  page?: number;
  order?: string;
};

const ProductsList = async ({
  searchParams,
  params,
}: {
  searchParams: SearchParams;
  params: { category: string };
}) => {
  const {
    productId,
    productName,
    productCategory,
    minPrice,
    maxPrice,
    page,
    order,
  } = searchParams;

  const { category } = params;
  const mainCategory = category.charAt(0).toUpperCase() + category.slice(1);

  const products = await getProducts(
    productId,
    productName,
    mainCategory,
    productCategory,
    minPrice,
    maxPrice,
    page,
    order
  );
  //count total value to display and for pagination
  const total = await countProducts(
    productId,
    productName,
    mainCategory,
    productCategory,
    minPrice,
    maxPrice
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold max-md:text-4xl max-md:my-4">
          {mainCategory}
        </h1>
        <h2 className="text-xl max-md:text-4xl max-md:my-4">
          {total} items<span className="max-md:hidden"> found</span>
        </h2>
      </div>
      <ProductPagination
        searchParams={searchParams}
        total={total}
        productName={productName}
        productCategory={productCategory}
        minPrice={minPrice}
        maxPrice={maxPrice}
      />
      <div className="grid grid-cols-3 gap-4 w-[800px] max-lg:w-[688px] max-md:w-[327px] max-md:grid-cols-1">
        {products.map((singleProduct: Product) => (
          <SingleProduct
            key={singleProduct.id}
            singleProduct={singleProduct}
            mainCategory={mainCategory}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductsList;
