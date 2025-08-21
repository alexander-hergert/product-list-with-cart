import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import Image from "next/image";
import Filter from "@/components/Filter";
import Sort from "@/components/Sort";
import { checkIfAdmin } from "@/lib/auth";
import DeleteProduct from "@/components/products/DeleteProduct";
import ProductAdminPagination from "@/components/ProductAdminPagination";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

const fetchProducts = async (
  productId: string | undefined,
  productName: string | undefined,
  productCategory: string | undefined,
  minPrice: string | undefined,
  maxPrice: string | undefined,
  page: number | undefined,
  order: string | undefined
) => {
  const { userId } = auth();
  //Check if user is admin
  if (!(await checkIfAdmin(userId))) {
    redirect("/dashboard");
  }

  //Fetch data
  try {
    const products = await prisma.products.findMany({
      where: {
        id: { contains: productId, mode: "insensitive" },
        ...(productName && {
          name: { contains: productName, mode: "insensitive" },
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
        ...(productCategory && {
          sub_category: { contains: productCategory, mode: "insensitive" },
        }),
        ...(minPrice && { price: { gte: Number(minPrice) } }),
        ...(maxPrice && { price: { lte: Number(maxPrice) } }),
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

const pathnames = [
  { name: "Breakfast", src: "/dashboard/products/breakfast" },
  { name: "Lunch", src: "/dashboard/products/lunch" },
  { name: "Dessert", src: "/dashboard/products/dessert" },
  { name: "Drinks", src: "/dashboard/products/drinks" },
  { name: "Menu", src: "/dashboard/products/menu" },
];

const ProductsPage = async ({
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

  const products = await fetchProducts(
    productId,
    productName,
    productCategory,
    minPrice,
    maxPrice,
    page,
    order
  );

  const total = await countProducts(
    productId,
    productName,
    productCategory,
    minPrice,
    maxPrice
  );
  const isAdmin = await checkIfAdmin(auth().userId);
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="mt-4 gap-4 flex flex-wrap justify-center m-auto max-lg:flex-col max-md:w-[327px]">
        <div>
          <Filter isAdmin={isAdmin} />
        </div>
        <div>
          <Sort isAdmin={isAdmin} />
        </div>
      </div>
      <ProductAdminPagination
        searchParams={searchParams}
        total={total}
        id={productId}
        productName={productName}
        productCategory={productCategory}
        minPrice={minPrice}
        maxPrice={maxPrice}
      />
      <div className="flex gap-4 items-center">
        {pathnames.map((pathname) => (
          <Link
            key={pathname.name}
            href={pathname.src}
            className="text-xl text-blue-500 hover:text-blue-700"
          >
            {pathname.name}
          </Link>
        ))}
      </div>
      <div
        className="flex items-center justify-center m-auto w-full max-lg:w-[800px] max-md:w-[400px]
       gap-4 my-4"
      >
        <h1 className="text-2xl text-center font-bold">Products</h1>
        <h2 className="text-xl max-md:text-2xl">
          {total} items<span className="max-md:hidden"> found</span>
        </h2>
      </div>
      <Link
        className="className= border rounded p-4 hover:bg-blue-700 hover:text-white md:w-[600px] max-md:w-[300px] text-center"
        href="/dashboard/products/new_product"
      >
        Create New Product
      </Link>
      <div
        className="grid grid-cols-3 place-items-center m-auto w-[1200px] mt-4 max-lg:grid-cols-2 max-md:grid-cols-1 
      max-lg:w-[800px] max-md:w-[400px] gap-4 gap-y-8"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded-xl flex flex-col shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <Link
              href={`/dashboard/products/${product.main_category.toLocaleLowerCase()}/${
                product.id
              }`}
            >
              <div>
                <div className="w-[300px]">
                  <Image
                    className="w-full rounded-t-xl"
                    src={product.image}
                    alt={product.name}
                    width={300}
                    height={300}
                  />
                </div>
                <div className="p-2">
                  <div className="flex gap-4 items-center max-w-[250px]">
                    <label>Name:</label>
                    <h2 className="truncate">{product.name}</h2>
                  </div>
                  <div className="flex gap-4 items-center max-w-[250px]">
                    <label>Description:</label>
                    <p className="truncate">{product.description}</p>
                  </div>
                  <div className="flex gap-4 items-center max-w-[250px]">
                    <label>Price:</label>
                    <p className="truncate">${product.price}</p>
                  </div>
                  <div className="flex gap-4 items-center max-w-[250px]">
                    <label>Rating:</label>
                    <p>{product.rating}</p>
                  </div>
                </div>
              </div>
            </Link>
            <Link
              href={`/dashboard/products/${product.main_category.toLocaleLowerCase()}/${
                product.id
              }/edit_product`}
              className="border rounded p-2 my-2 hover:bg-blue-700 hover:text-white self-center w-[95%] text-center"
            >
              Edit
            </Link>
            <DeleteProduct id={product.id} />
          </div>
        ))}
      </div>
      <Link
        className="border block w-[20%] max-md:w-[50%] m-auto mt-4 rounded p-2 my-2 hover:bg-blue-700 hover:text-white self-center text-center"
        href="/dashboard"
      >
        ... Back to Dashboard
      </Link>
    </div>
  );
};

export default ProductsPage;
