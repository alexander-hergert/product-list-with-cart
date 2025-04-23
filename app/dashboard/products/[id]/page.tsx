import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import Image from "next/image";
import dynamic from "next/dynamic";
import { checkIfAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

const DeleteProduct = dynamic(
  () => import("@/components/products/DeleteProduct"),
  {
    ssr: false,
  }
);

const fetchProduct = async (id: string) => {
  const { userId } = auth();
  //Check if user is admin
  if (!(await checkIfAdmin(userId))) {
    redirect("/dashboard");
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
      <h1 className="text-2xl mb-4 text-center">Product Details</h1>
      <div className="flex flex-col items-center border rounded-xl p-4 shadow-md md:min-w-[800px] md:w-1/3 m-auto max-md:w-[80%]">
        <div>
          <Image
            className="rounded-xl m-auto"
            src={product ? product.image : ""}
            alt={product ? product.name : ""}
            width={300}
            height={300}
          />
          <div className="flex gap-4 font-bold items-center max-md:flex-col text-center my-4">
            <label>Name:</label>
            <h2>{product?.name}</h2>
          </div>
          <div className="flex gap-4 max-md:flex-col text-center my-4">
            <label>Description:</label>
            <p>{product?.description}</p>
          </div>
          <div className="flex gap-4 items-center max-md:flex-col text-center my-4">
            <label>Price:</label>
            <p>${product?.price}</p>
          </div>
          <div className="flex gap-4 items-center max-md:flex-col text-center my-4">
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
        <Link
          href={`/dashboard/products/${id}/edit_product`}
          className="border rounded p-2 my-2 hover:bg-blue-700 hover:text-white self-center w-[95%] text-center"
        >
          Edit
        </Link>
        <DeleteProduct id={id} />
      </div>
    </div>
  );
};

export default ProductDetailsPage;
