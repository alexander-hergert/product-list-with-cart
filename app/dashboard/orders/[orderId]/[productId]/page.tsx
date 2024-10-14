import dynamic from "next/dynamic";
import { auth } from "@clerk/nextjs/dist/types/server";

const CreateFeedback = dynamic(
  () => import("@/components/orders/CreateFeedback"),
  {
    ssr: false,
  }
);

interface Params {
  productId: string;
  orderId: string;
}

const ProductFeedback = async ({ params }: { params: Params }) => {
  const { orderId, productId } = params;
  return (
    <div>
      Create Feedback for product {productId} in order {orderId}
      <CreateFeedback productId={productId} orderId={orderId} />
    </div>
  );
};

export default ProductFeedback;
