import dynamic from "next/dynamic";

const CreateFeedback = dynamic(
  () => import("@/components/feedback/CreateFeedback"),
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
      <h1 className="text-2xl mb-4 text-center">Create Feedback</h1>
      <h2 className="text-xl mb-4 text-center">
        Create Feedback for product {productId} in order {orderId}
      </h2>
      <CreateFeedback productId={productId} orderId={orderId} />
    </div>
  );
};

export default ProductFeedback;
