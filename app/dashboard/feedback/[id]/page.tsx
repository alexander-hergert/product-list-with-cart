import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { checkIfAdmin } from "@/lib/auth";

const prisma = new PrismaClient();

const fetchFeedback = async (id: string) => {
  const { userId } = auth();
  //Check if user is admin
  const isAdmin = await checkIfAdmin(userId);
  //Fetch data
  try {
    const feedback = await prisma.feedbacks.findUnique({
      where: {
        id,
        userId: (!isAdmin && userId) || undefined,
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

interface Params {
  id: string;
}

const fetchUserName = async (id: string) => {
  try {
    const user = await prisma.users.findUnique({
      where: {
        id,
      },
    });
    return user?.name;
  } catch (error) {
    console.error("Error fetching user:", error);
    return "";
  } finally {
    await prisma.$disconnect();
  }
};

const fetchProductName = async (id: string) => {
  try {
    const product = await prisma.products.findUnique({
      where: {
        id,
      },
    });
    return product?.name;
  } catch (error) {
    console.error("Error fetching product:", error);
    return "";
  } finally {
    await prisma.$disconnect();
  }
};

const FeedbackDetailsPage = async ({ params }: { params: Params }) => {
  const { id } = params;
  const feedback = await fetchFeedback(id);
  const userName = await fetchUserName(feedback?.userId || "");
  const productName = await fetchProductName(feedback?.productId || "");

  return (
    <div>
      <h1 className="text-2xl mb-4 text-center">Feedback Details</h1>
      <div className="flex flex-col items-center border rounded-xl p-4 shadow-md md:min-w-[800px] md:w-1/2 m-auto max-md:w-[80%]">
        <div className="flex gap-4 items-center max-md:flex-col text-center">
          <label className="text-xl w-[200px] max-md:text-center">Title:</label>
          <h2 className="w-[300px] max-md:text-center">{feedback?.title}</h2>
        </div>
        <div className="flex gap-4 items-center max-md:flex-col text-center my-4">
          <label className="text-xl w-[200px] max-md:text-center">
            Username:
          </label>
          <p className="w-[300px] max-md:text-center">{userName}</p>
        </div>
        <div className="flex gap-4 items-center max-md:flex-col text-center my-4">
          <label className="text-xl w-[200px] max-md:text-center">
            Product Id:
          </label>
          <p className="w-[300px] max-md:text-center">{feedback?.productId}</p>
        </div>
        <div className="flex gap-4 items-center max-md:flex-col text-center my-4">
          <label className="text-xl w-[200px] max-md:text-center">
            Product Name:
          </label>
          <p className="w-[300px] max-md:text-center">{productName}</p>
        </div>
        <div className="flex gap-4 items-center max-md:flex-col text-center">
          <label className="text-xl w-[200px] max-md:text-center">
            Comment:
          </label>
          <p className="w-[300px] max-md:text-center">{feedback?.comment}</p>
        </div>
        <div className="flex gap-4 items-center max-md:flex-col text-center my-4">
          <label className="text-xl w-[200px] max-md:text-center">Date:</label>
          <p className="w-[300px] max-md:text-center">
            {feedback?.createdAt.toDateString()}
          </p>
        </div>
      </div>
      <Link
        className="text-blue-500 hover:text-blue-700 block m-auto text-center mt-4"
        href="/dashboard/feedback"
      >
        ... Back to Feedback
      </Link>
    </div>
  );
};

export default FeedbackDetailsPage;
