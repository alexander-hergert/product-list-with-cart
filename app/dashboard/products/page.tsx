import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import Image from "next/image";
import dynamic from "next/dynamic";

const prisma = new PrismaClient();
const { userId } = auth();

const DeleteProduct = dynamic(
  () => import("@/components/products/DeleteProduct"),
  {
    ssr: false,
  }
);

const Filter = dynamic(() => import("@/components/dashboard/Filter"), {
  ssr: false,
});

const Sort = dynamic(() => import("@/components/dashboard/Sort"), {
  ssr: false,
});

const fetchProducts = async (
  productname: string | undefined,
  minPrice: string | undefined,
  maxPrice: string | undefined,
  order: string | undefined
) => {
  //Check if user is admin
  try {
    const user = await prisma.users.findUnique({
      where: {
        id: userId ? userId : undefined,
      },
    });
    if (user?.role !== "ADMIN") {
      throw new Error("User is not an admin");
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    return [];
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
    <div>
      <h1>Products</h1>
      <h2>Filter</h2>
      <Filter />
      <h2>Sort</h2>
      <Sort />
      <Link
        className="text-blue-500 hover:text-blue-700"
        href="/dashboard/products/new_product"
      >
        Create New...
      </Link>
      <br />
      <div className="grid grid-cols-2">
        {products.map((product) => (
          <div>
            <Link href={`/dashboard/products/${product.id}`} key={product.id}>
              <div>
                <Image
                  src={product.image}
                  alt={product.name}
                  width={200}
                  height={200}
                />
                <div className="flex gap-4 items-center">
                  <label>Name:</label>
                  <h2>{product.name}</h2>
                </div>
                <div className="flex gap-4 items-center">
                  <label>Description:</label>
                  <p>{product.description}</p>
                </div>
                <div className="flex gap-4 items-center">
                  <label>Price:</label>
                  <p>${product.price}</p>
                </div>
                <div className="flex gap-4 items-center">
                  <label>Rating:</label>
                  <p>{product.rating}</p>
                </div>
              </div>
            </Link>
            <Link href={`/dashboard/products/${product.id}/edit_product`}>
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
