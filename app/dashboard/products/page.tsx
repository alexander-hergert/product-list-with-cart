import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import Image from "next/image";

const prisma = new PrismaClient();
const { userId } = auth();

const fetchProducts = async () => {
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

const ProductsPage = async () => {
  const products = await fetchProducts();
  return (
    <div>
      <h1>Products</h1>
      <br />
      <div className="grid grid-cols-2">
        {products.map((product) => (
          <Link href={`/dashboard/products/${product.id}`} key={product.id}>
            <div>
              <Image
                src={product.image}
                alt={product.name}
                width={200}
                height={200}
              />
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              <p>{product.price}</p>
              <p>{product.rating}</p>
            </div>
          </Link>
        ))}
      </div>
      <Link className="text-blue-500 hover:text-blue-700" href="/dashboard">
        To Dashboard
      </Link>
    </div>
  );
};

export default ProductsPage;
