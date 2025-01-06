import { PrismaClient } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
import { checkIfAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";

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
      <h1 className="text-2xl mb-4 text-center">Edit Feedback</h1>
      <EditFeedback feedback={feedback} id={id} />
    </div>
  );
};

export default EditFeedbackPage;
