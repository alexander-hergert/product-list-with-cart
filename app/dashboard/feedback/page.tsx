import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import dynamic from "next/dynamic";
import { truncateToUTCDateStart, truncateToUTCDateEnd } from "@/lib/utils";

const prisma = new PrismaClient();
const { userId } = auth();

const Filter = dynamic(() => import("@/components/dashboard/Filter"), {
  ssr: false,
});

const Sort = dynamic(() => import("@/components/dashboard/Sort"), {
  ssr: false,
});

const fetchFeedbacks = async (
  minDate: string | undefined,
  maxDate: string | undefined,
  order: string | undefined
) => {
  //Check if user is admin
  try {
    const user = await prisma.users.findUnique({
      where: {
        id: userId ? userId : undefined,
      },
    });
    if (user?.role !== "ADMIN") {
      throw new Error("User is not an admin");
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    return [];
  }
  //Fetch data
  try {
    const feedbacks = await prisma.feedbacks.findMany({
      where: {
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
          <Link
            href={`/dashboard/feedback/${feedback.id}`}
            key={feedback.id}
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
        ))}
      </div>
      <Link className="text-blue-500 hover:text-blue-700" href="/dashboard">
        To Dashboard
      </Link>
    </div>
  );
};

export default FeedbackPage;
