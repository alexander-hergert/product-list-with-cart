import dynamic from "next/dynamic";
import { checkIfAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CreateFeedback = dynamic(
  () => import("@/components/feedback/CreateFeedback"),
  {
    ssr: false,
  }
);
const fetchProduct = async (id: string) => {
  const { userId } = auth();
  //Check if user is admin
  if (!(await checkIfAdmin(userId))) {
    redirect("/dashboard");
  }
  //Fetch data
  try {
    const product = await prisma.products.findUnique({
      where: {
        id,
      },
    });
    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
};

interface Params {
  productId: string;
  orderId: string;
}

const ProductFeedback = async ({ params }: { params: Params }) => {
  const { orderId, productId } = params;
  const product = await fetchProduct(productId);
  return (
    <div>
      <h1 className="text-2xl mb-4 text-center">Create Feedback</h1>
      <h2 className="text-xl mb-4 text-center">
        Create Feedback for product{" "}
        <span className="font-bold">{product?.name}</span> in order{" "}
        <span className="font-bold">{orderId}</span>
      </h2>
      <CreateFeedback productId={productId} orderId={orderId} />
    </div>
  );
};

export default ProductFeedback;
