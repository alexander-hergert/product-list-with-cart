import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { checkIfAdmin } from "@/lib/auth";
import Image from "next/image";
import DeleteFeedback from "@/components/feedback/DeleteFeedback";
import { redirect } from "next/navigation";

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

const fetchProduct = async (id: string) => {
  try {
    const product = await prisma.products.findUnique({
      where: {
        id,
      },
    });
    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return "";
  } finally {
    await prisma.$disconnect();
  }
};

//Check if userId owns the feedbackId or if user is admin
const checkOwnership = async (feedbackId: string) => {
  const { userId } = auth();
  if (!userId) return false;

  const isAdmin = await checkIfAdmin(userId);
  if (isAdmin) return true;

  try {
    const feedback = await prisma.feedbacks.findUnique({
      where: {
        id: feedbackId,
        userId,
      },
    });
    return !!feedback;
  } catch (error) {
    console.error("Error checking ownership:", error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
};

const FeedbackDetailsPage = async ({ params }: { params: Params }) => {
  const isAdmin = await checkIfAdmin(auth().userId || "");
  //redirect if user is not admin and does not own the feedback
  const isOwner = await checkOwnership(params.id);
  if (!isOwner && !isAdmin) {
    redirect("/dashboard/feedback");
  }
  const { id } = params;
  const feedback = await fetchFeedback(id);
  const userName = await fetchUserName(feedback?.userId || "");
  const product = await fetchProduct(feedback?.productId || "");

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
        <Link
          href={
            isAdmin
              ? `/dashboard/products/${feedback?.productId}`
              : typeof product === "object" &&
                product !== null &&
                "main_category" in product
              ? `/products/${product?.main_category.toLocaleLowerCase()}/${
                  feedback?.productId
                }`
              : ""
          }
          className="flex gap-4 items-center max-md:flex-col text-center my-4"
        >
          <label className="text-xl w-[200px] max-md:text-center">
            Product Id:
          </label>
          <p className="text-blue-500 w-[300px] max-md:text-center">
            {feedback?.productId}
          </p>
        </Link>
        <div className="flex gap-4 items-center max-md:flex-col text-center my-4">
          <label className="text-xl w-[200px] max-md:text-center">
            Product Name:
          </label>
          <p className="w-[300px] max-md:text-center">
            {/* Type Guards */}
            {typeof product === "object" &&
              product !== null &&
              "name" in product &&
              product?.name}
            {typeof product === "object" &&
              product !== null &&
              "main_category" in product &&
              ` (${product?.main_category})`}
          </p>
        </div>
        <Image
          className="rounded-xl w-[150px] h-[150px] object-cover my-4"
          src={
            typeof product === "object" &&
            product !== null &&
            "name" in product &&
            product?.image
              ? product.image
              : "/placeholder.png"
          }
          alt={
            typeof product === "object" &&
            product !== null &&
            "name" in product &&
            product?.name
              ? product.name
              : "Product Image"
          }
          width={150}
          height={150}
        />
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
        <Link
          href={`/dashboard/feedback/${feedback?.id}/edit_feedback`}
          className="border rounded p-2 my-2 hover:bg-blue-700 hover:text-white self-center w-full text-center"
        >
          Edit
        </Link>
        <DeleteFeedback id={feedback?.id || ""} />
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
