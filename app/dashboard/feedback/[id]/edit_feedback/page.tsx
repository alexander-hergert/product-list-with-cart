import { PrismaClient } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

const prisma = new PrismaClient();

import dynamic from "next/dynamic";
const EditFeedback = dynamic(
  () => import("@/components/feedback/EditFeedback"),
  {
    ssr: false,
  }
);

const fetchFeedback = async (id: string) => {
  const { userId } = auth();
  //Check if user is present
  if (!userId) {
    redirect("/dashboard");
  }
  try {
    const feedback = await prisma.feedbacks.findUnique({
      where: {
        id,
        userId,
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

interface EditFeedbackPageProps {
  params: {
    id: string;
  };
}

const EditFeedbackPage = async ({ params }: EditFeedbackPageProps) => {
  const { id } = params;
  const feedback = await fetchFeedback(id);
  return (
    <div>
      <h1 className="text-2xl my-4 text-center">Edit Feedback</h1>
      <EditFeedback feedback={feedback} id={id} />
      <Link
        className="border block w-[20%] max-md:w-[50%] m-auto mt-4 rounded p-2 my-2 hover:bg-blue-700 hover:text-white self-center text-center"
        href={`/dashboard/feedback/${id}`}
      >
        ... Back to Feedback
      </Link>
    </div>
  );
};

export default EditFeedbackPage;
