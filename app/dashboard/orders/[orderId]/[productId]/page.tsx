interface Params {
  orderId: string;
  productId: string;
}

const ProductFeedback = async ({ params }: { params: Params }) => {
  const { orderId, productId } = params;
  return (
    <div>
      Create Feedback for product {productId} in order {orderId}
    </div>
  );
};

export default ProductFeedback;
