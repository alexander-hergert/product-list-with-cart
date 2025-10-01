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
      <h1 className="text-2xl my-4 text-center font-bold">Feedback Details</h1>
      <section className="flex flex-col items-center border rounded-xl p-4 shadow-md md:min-w-[800px] md:w-1/3 m-auto max-md:w-[80%]">
        <div className="flex max-md:gap-4 gap-8 max-lg:flex-col">
          <Image
            className="rounded-xl w-[400px] h-[400px] object-cover my-4"
            width={400}
            height={400}
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
          />
          <aside>
            <div className="flex gap-4 max-lg:flex-col max-lg:text-center my-4 min-lg:w-[300px]">
              <label className="font-bold">Title:</label>
              <h2>{feedback?.title}</h2>
            </div>
            <div className="flex gap-4 max-lg:flex-col max-lg:text-center my-4 min-lg:w-[300px]">
              <label className="font-bold">Username:</label>
              {isAdmin ? (
                <Link
                  href={`/dashboard/customers/${feedback?.userId}`}
                  className="max-md:text-center text-blue-500"
                >
                  {userName}
                </Link>
              ) : (
                <p>{userName}</p>
              )}
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
              className="flex gap-4 max-lg:flex-col max-lg:text-center my-4 min-lg:w-[300px]"
            >
              <label className="font-bold">Product Id:</label>
              <p className="text-blue-500">{feedback?.productId}</p>
            </Link>
            <div className="flex gap-4 max-lg:flex-col max-lg:text-center my-4 min-lg:w-[300px]">
              <label className="font-bold">Product Name:</label>
              <p>
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
            <div className="flex gap-4 max-lg:flex-col max-lg:text-center my-4 min-lg:w-[300px]">
              <label className="font-bold">Comment:</label>
              <p>{feedback?.comment}</p>
            </div>
            <div className="flex gap-4 max-lg:flex-col max-lg:text-center my-4 min-lg:w-[300px]">
              <label className="font-bold">Date:</label>
              <p>{feedback?.createdAt.toDateString()}</p>
            </div>
          </aside>
        </div>
        <Link
          href={`/dashboard/feedback/${feedback?.id}/edit_feedback`}
          className="border rounded p-2 my-2 hover:bg-blue-700 hover:text-white self-center w-full text-center"
        >
          Edit
        </Link>
        <DeleteFeedback id={feedback?.id || ""} />
      </section>
      <Link
        className="border block w-[20%] max-md:w-[50%] m-auto mt-4 rounded p-2 my-2 hover:bg-blue-700 hover:text-white self-center text-center"
        href="/dashboard/feedback"
      >
        ... Back to Feedback
      </Link>
    </div>
  );
};

export default FeedbackDetailsPage;
