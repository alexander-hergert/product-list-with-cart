import { PrismaClient } from "@prisma/client";
import Cart from "@/components/products/Cart";
import Image from "next/image";
import Link from "next/link";
import Rating from "@mui/material/Rating";
import Feedbacks from "@/components/feedback/Feedbacks";
import AddToCart from "@/components/products/AddToCart";

const prisma = new PrismaClient();

interface Params {
  id: string;
}

const fetchProduct = async (id: string) => {
  try {
    const product = await prisma.products.findUnique({
      where: {
        id: id,
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

const fetchFeedbacks = async (id: string) => {
  try {
    const feedback = await prisma.feedbacks.findMany({
      where: {
        productId: id,
      },
    });
    return feedback;
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
};

const fetchUsers = async (id: string) => {
  try {
    const user = await prisma.users.findUnique({
      where: {
        id: id,
      },
    });
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
};

const ProductsDetailsPage = async ({ params }: { params: Params }) => {
  const { id } = params;
  const product = await fetchProduct(id);

  if (!product) {
    return (
      <div>
        <h1 className="text-2xl my-4 text-center">Product Not Found</h1>
        <div className="flex flex-col items-center border rounded-xl p-4 shadow-md md:min-w-[800px] md:w-1/3 m-auto max-md:w-[80%]">
          <Link className="text-blue-500 hover:text-blue-700" href="/products">
            ... Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const feedbacks = await fetchFeedbacks(id);
  const users = feedbacks
    ? await Promise.all(
        feedbacks.map((feedback) => fetchUsers(feedback.userId))
      )
    : [];

  return (
    <main className="flex justify-center gap-8 max-lg:flex-col">
      <div className="md:min-w-[800px] md:w-1/3 max-md:m-auto max-md:w-[80%]">
        <h1 className="text-2xl my-4 text-center font-bold">Product Details</h1>
        <section className="flex flex-col items-center border rounded-xl p-4 shadow-md">
          <div className="flex max-md:gap-4 gap-8 max-lg:flex-col">
            <Image
              data-testid="product-image"
              className="rounded-xl m-auto"
              src={product.image}
              alt={product.name}
              width={400}
              height={400}
            />
            <aside>
              <div className="flex gap-4 items-center max-lg:flex-col text-center my-4 min-xl:w-[300px]">
                <label className="font-bold">Name:</label>
                <h2 data-testid="product-title">{product.name}</h2>
              </div>
              <div className="flex gap-4 items-center max-lg:flex-col text-center my-4 min-xl:w-[300px]">
                <label className="font-bold" htmlFor="mainCategory">
                  Main Category:
                </label>
                <p>{product?.main_category}</p>
              </div>
              <div className="flex gap-4 items-center max-lg:flex-col text-center my-4 min-xl:w-[300px]">
                <label className="font-bold" htmlFor="subCategory">
                  Sub Category:
                </label>
                <p>{product?.sub_category}</p>
              </div>
              <div className="flex gap-4 max-lg:flex-col max-lg:text-center my-4 min-lg:w-[300px]">
                <label className="font-bold">Description:</label>
                <p data-testid="product-description">{product?.description}</p>
              </div>
              <div className="flex gap-4 items-center max-lg:flex-col text-center my-4 min-xl:w-[300px]">
                <label className="font-bold" htmlFor="price">
                  Price:
                </label>
                <p data-testid="product-price">${product.price}</p>
              </div>
              <div className="flex gap-4 items-center max-lg:flex-col text-center my-4 min-xl:w-[300px]">
                <label className="font-bold" htmlFor="rating">
                  Rating:
                </label>
                <Rating name="rating" value={product.rating} readOnly />
              </div>
            </aside>
          </div>
          <div className="my-4">
            <AddToCart
              id={product.id}
              name={product.name}
              image={product.image}
              price={product.price}
            />
          </div>
          <Feedbacks
            feedbacks={feedbacks ?? []}
            users={users.filter((u): u is NonNullable<typeof u> => u !== null)}
          />
        </section>
        <Link
          className="border block w-[20%] max-md:w-[50%] m-auto mt-4 rounded p-2 my-2 hover:bg-blue-700 hover:text-white self-center text-center"
          href={`/products/${product.main_category.toLocaleLowerCase()}`}
        >
          ... Back to Products
        </Link>
      </div>
      <aside className="mt-4">
        <Cart />
      </aside>
    </main>
  );
};

export default ProductsDetailsPage;
