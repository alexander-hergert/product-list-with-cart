import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import Image from "next/image";

const prisma = new PrismaClient();

const fetchProduct = async (id: string) => {
  const { userId } = auth();
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
    return null;
  }
  //Fetch data
  try {
    const product = await prisma.products.findUnique({
      where: {
        id,
      },
    });
    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
};

interface Params {
  id: string;
}

const ProductDetailsPage = async ({ params }: { params: Params }) => {
  const { id } = params;
  const product = await fetchProduct(id);
  return (
    <div>
      <h1>Product Details</h1>
      <br />
      <div>
        <Image
          src={product ? product.image : ""}
          alt={product ? product.name : ""}
          width={200}
          height={200}
        />
        <div className="flex gap-4 items-center">
          <label>Name:</label>
          <h2>{product?.name}</h2>
        </div>
        <div className="flex gap-4 items-center">
          <label>Description:</label>
          <p>{product?.description}</p>
        </div>
        <div className="flex gap-4 items-center">
          <label>Price:</label>
          <p>${product?.price}</p>
        </div>
        <div className="flex gap-4 items-center">
          <label>Rating:</label>
          <p>{product?.rating}</p>
        </div>
      </div>
      <Link
        className="text-blue-500 hover:text-blue-700"
        href="/dashboard/products"
      >
        ... Back to Products
      </Link>
    </div>
  );
};

export default ProductDetailsPage;
