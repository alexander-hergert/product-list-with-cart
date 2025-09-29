import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import Image from "next/image";
import { checkIfAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import Rating from "@mui/material/Rating";
import DeleteProduct from "@/components/products/DeleteProduct";

const prisma = new PrismaClient();

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
      <h1 className="text-2xl my-4 text-center font-bold">Product Details</h1>
      <section className="flex justify-center flex-col items-center border rounded-xl p-4 shadow-md md:min-w-[800px] md:w-1/3 m-auto max-md:w-[80%]">
        <div className="flex max-md:gap-4 gap-8 max-lg:flex-col">
          <Image
            className="rounded-xl m-auto"
            src={product ? product.image : ""}
            alt={product ? product.name : ""}
            width={400}
            height={400}
          />
          <aside>
            <div className="flex gap-4 items-center max-lg:flex-col text-center my-4 min-xl:w-[300px]">
              <label className="font-bold">Name:</label>
              <h2>{product?.name}</h2>
            </div>
            <div className="flex gap-4 items-center max-lg:flex-col text-center my-4 min-lg:w-[300px]">
              <label className="font-bold" htmlFor="mainCategory">
                Main Category:
              </label>
              <p>{product?.main_category}</p>
            </div>
            <div className="flex gap-4 items-center max-lg:flex-col text-center my-4 min-lg:w-[300px]">
              <label className="font-bold" htmlFor="subCategory">
                Sub Category:
              </label>
              <p>{product?.sub_category}</p>
            </div>
            <div className="flex gap-4 max-lg:flex-col max-lg:text-center my-4 min-lg:w-[300px]">
              <label className="font-bold">Description:</label>
              <p>{product?.description}</p>
            </div>
            <div className="flex gap-4 items-center max-lg:flex-col text-center my-4 min-lg:w-[300px]">
              <label className="font-bold">Price:</label>
              <p>${product?.price}</p>
            </div>
            <div className="flex gap-4 items-center max-lg:flex-col text-center my-4 min-lg:w-[300px]">
              <label htmlFor="rating" className="font-bold">
                Rating
              </label>
              <Rating name="rating" value={product?.rating} readOnly />
            </div>
          </aside>
        </div>
        <Link
          href={`/dashboard/products/${product?.main_category.toLocaleLowerCase()}/${id}/edit_product`}
          className="border rounded p-2 my-2 hover:bg-blue-700 hover:text-white self-center w-[95%] text-center"
        >
          Edit
        </Link>
        <DeleteProduct id={id} />
      </section>
      <Link
        className="border block w-[20%] max-md:w-[50%] m-auto mt-4 rounded p-2 my-2 hover:bg-blue-700 hover:text-white self-center text-center"
        href="/dashboard/products"
      >
        ... Back to Products
      </Link>
    </div>
  );
};

export default ProductDetailsPage;
