import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { truncateToUTCDateStart, truncateToUTCDateEnd } from "@/lib/utils";
import Filter from "@/components/dashboard/Filter";
import Sort from "@/components/dashboard/Sort";
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
      <h1>Feedback</h1>
      <h2>Filter</h2>
      <Filter />
      <h2>Sort</h2>
      <Sort />
      <div className="grid grid-cols-2">
        {feedbacks.map((feedback) => (
          <div key={feedback.id}>
            <Link
              href={`/dashboard/feedback/${feedback.id}`}
              className="border"
            >
              <div className="flex gap-4 items-center">
                <label>Title:</label>
                <h2>{feedback?.title}</h2>
              </div>
              <div className="flex gap-4 items-center">
                <label>Comment:</label>
                <p>{feedback?.comment}</p>
              </div>
              <div className="flex gap-4 items-center">
                <label>Date:</label>
                <p>{feedback?.createdAt.toDateString()}</p>
              </div>
            </Link>
            <Link href={`/dashboard/feedback/${feedback.id}/edit_feedback`}>
              Edit
            </Link>
            <DeleteFeedback id={feedback.id} />
          </div>
        ))}
      </div>
      <Link className="text-blue-500 hover:text-blue-700" href="/dashboard">
        To Dashboard
      </Link>
    </div>
  );
};

export default FeedbackPage;
