import { PrismaClient } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

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
      <div>
        <Image
          src={product?.image || ""}
          width={200}
          height={200}
          alt={product?.name || ""}
        />
        <h2>{product?.name}</h2>
        <p>{product?.description}</p>
        <p>Price: ${product?.price}</p>
        <p>Rating: {product?.rating}</p>
      </div>
      <div>
        <h3>Feedback</h3>
        {feedbacks?.map((singleFeedback, i) => (
          <div key={singleFeedback.id} className="border">
            <p>{singleFeedback.title}</p>
            <p>{singleFeedback.comment}</p>
            <p>By: {users?.[i]?.email}</p>
          </div>
        ))}
      </div>
      <Link className="text-blue-500 hover:text-blue-700" href="/products">
        ... Back to Products
      </Link>
    </div>
  );
};

export default ProductsDetailsPage;
