import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const fetchFeedback = async (id: string) => {
  const { userId } = auth();
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
    return null;
  }
  //Fetch data
  try {
    const feedback = await prisma.feedbacks.findUnique({
      where: {
        id,
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

const FeedbackDetailsPage = async ({ params }: { params: Params }) => {
  const { id } = params;
  const feedback = await fetchFeedback(id);
  const userName = await fetchUserName(feedback?.userId || "");
  return (
    <div>
      <h1>Feedback Details</h1>
      <br />
      <div>
        <div className="flex gap-4 items-center">
          <label>Title:</label>
          <h2>{feedback?.title}</h2>
        </div>
        <div className="flex gap-4 items-center">
          <label>Username:</label>
          <p>{userName}</p>
        </div>
        <div className="flex gap-4 items-center">
          <label>Comment:</label>
          <p>{feedback?.comment}</p>
        </div>
        <div className="flex gap-4 items-center">
          <label>Date:</label>
          <p>{feedback?.createdAt.toDateString()}</p>
        </div>
      </div>
      <Link
        className="text-blue-500 hover:text-blue-700"
        href="/dashboard/feedback"
      >
        ... Back to Feedback
      </Link>
    </div>
  );
};

export default FeedbackDetailsPage;
