import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { truncateToUTCDateStart, truncateToUTCDateEnd } from "@/lib/utils";
import Filter from "@/components/Filter";
import Sort from "@/components/Sort";
import { checkIfAdmin } from "@/lib/auth";
import DeleteFeedback from "@/components/feedback/DeleteFeedback";
import FeedbackPagination from "@/components/feedback/FeedbackPagination";

const prisma = new PrismaClient();

const fetchFeedbacks = async (
  username: string | undefined,
  minDate: string | undefined,
  maxDate: string | undefined,
  page: number | undefined,
  order: string | undefined
) => {
  const { userId } = auth();
  //Check if user is admin
  const isAdmin = await checkIfAdmin(userId);

  //Fetch data
  try {
    //Fetch queried user
    const queriedUser = await prisma.users.findMany({
      where: {
        name: {
          contains: username,
          mode: "insensitive",
        },
      },
    });
    const feedbacks = await prisma.feedbacks.findMany({
      where: {
        //Map the userIds only from queriedUser
        userId:
          (isAdmin ? { in: queriedUser.map((user) => user.id) } : userId) ||
          undefined,
        createdAt: {
          ...(minDate && { gte: truncateToUTCDateStart(minDate) }),
          ...(maxDate && { lte: truncateToUTCDateEnd(maxDate) }),
        },
      },
      orderBy: {
        ...((order === "usernameAsc" && { user: { name: "asc" } }) ||
          (order === "usernameDesc" && { user: { name: "desc" } })),
        ...((order === "dateAsc" && { createdAt: "asc" }) ||
          (order === "dateDesc" && { createdAt: "desc" })),
      },
      skip: ((page || 1) - 1) * 9, //optional depending on page number,
      take: 9, //fix value pagesize
    });
    return feedbacks;
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    return [];
  } finally {
    await prisma.$disconnect();
  }
};

const countFeedbacks = async (
  username: string | undefined,
  minDate: string | undefined,
  maxDate: string | undefined
): Promise<number> => {
  try {
    const total = await prisma.feedbacks.count({
      where: {
        ...(username && {
          user: { name: { contains: username, mode: "insensitive" } },
        }),
        ...(minDate && { createdAt: { gte: truncateToUTCDateStart(minDate) } }),
        ...(maxDate && { createdAt: { lte: truncateToUTCDateEnd(maxDate) } }),
      },
    });
    return total;
  } catch (error) {
    console.error("Error counting customers:", error);
    return 0;
  } finally {
    await prisma.$disconnect();
  }
};

type SearchParams = {
  username?: string;
  minDate?: string;
  maxDate?: string;
  page?: number;
  order?: string;
};

const FeedbackPage = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}) => {
  const { userId } = auth();
  const isAdmin = await checkIfAdmin(userId);
  const { username, minDate, maxDate, page, order } = searchParams;
  const feedbacks = await fetchFeedbacks(
    username,
    minDate,
    maxDate,
    page,
    order
  );
  const total = await countFeedbacks(username, minDate, maxDate);

  return (
    <div>
      <div className="mt-4 gap-4 flex flex-wrap justify-center m-auto max-lg:flex-col max-md:w-[327px]">
        <div>
          <Filter isAdmin={isAdmin} />
        </div>
        <div>
          <Sort isAdmin={isAdmin} />
        </div>
      </div>
      <div
        className="flex items-center justify-center m-auto w-full max-lg:w-[800px] max-md:w-[400px]
       gap-4 my-4"
      >
        <h1 className="text-2xl text-center font-bold">Feedback</h1>
        <h2 className="text-xl max-md:text-2xl">
          {total} items<span className="max-md:hidden"> found</span>
        </h2>
      </div>
      <FeedbackPagination
        searchParams={searchParams}
        total={total}
        username={username}
        minDate={minDate}
        maxDate={maxDate}
      />
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
              href={`/dashboard/feedback/${feedback?.id}/edit_feedback`}
              className="border rounded p-2 my-2 hover:bg-blue-700 hover:text-white self-center w-full text-center"
            >
              Edit
            </Link>
            <DeleteFeedback id={feedback?.id} />
          </div>
        ))}
      </div>
      <Link
        className="border block w-[20%] max-md:w-[50%] m-auto mt-4 rounded p-2 my-2 hover:bg-blue-700 hover:text-white self-center text-center"
        href="/dashboard"
      >
        ... Back to Dashboard
      </Link>
    </div>
  );
};

export default FeedbackPage;
