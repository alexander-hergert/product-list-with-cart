import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import Image from "next/image";
import dynamic from "next/dynamic";
import Filter from "@/components/Filter";
import Sort from "@/components/Sort";
import { checkIfAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

const DeleteProduct = dynamic(
  () => import("@/components/products/DeleteProduct"),
  {
    ssr: false,
  }
);

const fetchProducts = async (
  productname: string | undefined,
  minPrice: string | undefined,
  maxPrice: string | undefined,
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
        ...(productname && {
          name: { contains: productname, mode: "insensitive" },
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
  productname?: string;
  minPrice?: string;
  maxPrice?: string;
  order?: string;
};

const ProductsPage = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}) => {
  const { productname, minPrice, maxPrice, order } = searchParams;
  const products = await fetchProducts(productname, minPrice, maxPrice, order);
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="m-auto max-lg:flex-col max-md:w-[327px]">
        <div>
          <h2 className="text-2xl text-center">Filter</h2>
          <Filter />
        </div>
        <div>
          <h2 className="text-2xl text-center">Sort</h2>
          <Sort />
        </div>
      </div>
      <Link
        className="className= border rounded p-4 hover:bg-blue-700 hover:text-white md:w-[600px] max-md:w-[300px] text-center"
        href="/dashboard/products/new_product"
      >
        Create New Product
      </Link>
      <div
        className="grid grid-cols-2 place-items-center m-auto w-[1200px] mt-4 max-lg:grid-cols-2 max-md:grid-cols-1 
      max-lg:w-[800px] max-md:w-[400px] gap-4"
      >
        {products.map((product) => (
          <div key={product.id} className="border rounded-xl flex flex-col">
            <Link href={`/dashboard/products/${product.id}`}>
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
              href={`/dashboard/products/${product.id}/edit_product`}
              className="border rounded p-2 my-2 hover:bg-blue-700 hover:text-white self-center w-[95%] text-center"
            >
              Edit
            </Link>
            <DeleteProduct id={product.id} />
          </div>
        ))}
      </div>
      <Link className="text-blue-500 hover:text-blue-700" href="/dashboard">
        To Dashboard
      </Link>
    </div>
  );
};

export default ProductsPage;
