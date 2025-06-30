import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { truncateToUTCDateStart, truncateToUTCDateEnd } from "@/lib/utils";
import Filter from "@/components/Filter";
import Sort from "@/components/Sort";
import { checkIfAdmin } from "@/lib/auth";
import DeleteFeedback from "@/components/feedback/DeleteFeedback";

const prisma = new PrismaClient();

const fetchFeedbacks = async (
  minDate: string | undefined,
  maxDate: string | undefined,
  order: string | undefined
) => {
  const { userId } = auth();
  //Check if user is admin
  const isAdmin = await checkIfAdmin(userId);

  //Fetch data
  try {
    const feedbacks = await prisma.feedbacks.findMany({
      where: {
        userId: (!isAdmin && userId) || undefined,
        createdAt: {
          ...(minDate && { gte: truncateToUTCDateStart(minDate) }),
          ...(maxDate && { lte: truncateToUTCDateEnd(maxDate) }),
        },
      },
      orderBy: {
        ...((order === "dateAsc" && { createdAt: "asc" }) ||
          (order === "dateDesc" && { createdAt: "desc" })),
      },
    });
    return feedbacks;
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    return [];
  } finally {
    await prisma.$disconnect();
  }
};

type SearchParams = {
  minDate?: string;
  maxDate?: string;
  order?: string;
};

const FeedbackPage = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}) => {
  const { minDate, maxDate, order } = searchParams;
  const feedbacks = await fetchFeedbacks(minDate, maxDate, order);
  return (
    <div>
      <div className="m-auto max-lg:flex-col max-md:w-[327px]">
        <div>
          <h2 className="text-2xl text-center">Filter</h2>
          <Filter />
        </div>
        <div>
          <h2 className="text-2xl text-center">Sort</h2>
          <Sort />
        </div>
      </div>
      <div
        className="m-auto w-[1200px] mt-4 grid grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 
      max-lg:w-[800px] max-md:w-[400px] gap-4"
      >
        {feedbacks.map((feedback) => (
          <div
            key={feedback.id}
            className="border p-2 rounded-xl flex flex-col shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <Link href={`/dashboard/feedback/${feedback.id}`}>
              <div className="flex gap-4 items-center">
                <label>Title:</label>
                <h2 className="truncate-text">{feedback?.title}</h2>
              </div>
              <div className="flex gap-4 items-center">
                <label>Comment:</label>
                <p className="truncate-text">{feedback?.comment}</p>
              </div>
              <div className="flex gap-4 items-center">
                <label>Date:</label>
                <p>{feedback?.createdAt.toDateString()}</p>
              </div>
            </Link>
            <Link
              href={`/dashboard/feedback/${feedback.id}/edit_feedback`}
              className="border rounded p-2 my-2 hover:bg-blue-700 hover:text-white self-center w-full text-center"
            >
              Edit
            </Link>
            <DeleteFeedback id={feedback.id} />
          </div>
        ))}
      </div>
      <Link
        className="text-blue-500 hover:text-blue-700 block m-auto text-center mt-4"
        href="/dashboard"
      >
        To Dashboard
      </Link>
    </div>
  );
};

export default FeedbackPage;
