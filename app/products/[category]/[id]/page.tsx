import { PrismaClient } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import Rating from "@mui/material/Rating";

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
  const feedbacks = await fetchFeedbacks(id);
  const users = feedbacks
    ? await Promise.all(
        feedbacks.map((feedback) => fetchUsers(feedback.userId))
      )
    : [];

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
          <div className="flex gap-2">
            <label htmlFor="rating">Rating</label>
            <Rating name="rating" value={product?.rating} readOnly />
          </div>
        </div>
        <div>
          <h3>Feedback for product</h3>
          {feedbacks?.map((singleFeedback, i) => (
            <div key={singleFeedback.id} className="border">
              <p>{singleFeedback.title}</p>
              <p>{singleFeedback.comment}</p>
              <p>By: {users?.[i]?.email}</p>
            </div>
          ))}
        </div>
        <Link
          className="text-blue-500 hover:text-blue-700"
          href={`/products/${product?.main_category.toLocaleLowerCase()}`}
        >
          ... Back to Products
        </Link>
      </div>
    </div>
  );
};

export default ProductsDetailsPage;
