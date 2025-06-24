import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import dynamic from "next/dynamic";
import { PrismaClient } from "@prisma/client";
import OrderProducts from "@/components/orders/OrderProducts";
import OrderCustomer from "@/components/orders/OrderCustomer";
import OrderFinish from "@/components/orders/OrderFinish";
import { checkIfAdmin } from "@/lib/auth";

const OrderStatusChange = dynamic(
  () => import("@/components/orders/OrderStatusChange"),
  {
    ssr: false,
  }
);

const prisma = new PrismaClient();

const fetchOrder = async (id: string) => {
  const { userId } = auth();
  //Check if user is admin
  const isAdmin = await checkIfAdmin(userId);
  //Fetch data
  try {
    const order = await prisma.orders.findUnique({
      where: {
        id,
        userId: (!isAdmin && userId) || undefined,
      },
    });
    return order;
  } catch (error) {
    console.error("Error fetching order:", error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
};

interface Params {
  orderId: string;
}

const OrderDetailsPage = async ({ params }: { params: Params }) => {
  const { orderId } = params;
  const order = await fetchOrder(orderId);
  const { userId } = auth();
  //Check if user is admin
  const isAdmin = await checkIfAdmin(userId);

  return (
    <div className="m-auto max-w-[600px] max:md:max-w-[327px] pb-4">
      <h1 className="text-2xl text-center my-4">Order Details</h1>
      <div className="border p-2 rounded-xl">
        <div className="flex gap-4 items-start">
          <label className="w-[6rem]">Order ID:</label>
          <h2 className="w-[32rem]">{order?.id}</h2>
        </div>
        <div className="flex gap-4 items-start my-4">
          <label className="w-[6rem]">Products IDs:</label>
          <ul className="w-[32rem] list-disc">
            {order?.productIds.map((productId, index) => (
              <li key={index}>{productId}</li>
            ))}
          </ul>
        </div>
        <div className="flex gap-4 items-start">
          <label className="w-[6rem]">Price:</label>
          <ul className="w-[32rem] list-disc">
            {order?.productIdsPrice.map((productIdPrice, index) => (
              <li key={index}>${productIdPrice}</li>
            ))}
          </ul>
        </div>
        <div className="flex gap-4 items-start my-4">
          <label className="w-[6rem]">Quantity:</label>
          <ul className="w-[32rem] list-disc">
            {order?.productIdsQuantity.map((productIdQuantity, index) => (
              <li key={index}>{productIdQuantity}</li>
            ))}
          </ul>
        </div>
        <div className="flex gap-4 items-start">
          <label className="w-[6rem]">Total Price:</label>
          <p className="w-[32rem]">${order?.totalPrice}</p>
        </div>
        <div className="flex gap-4 items-start">
          <label className="w-[6rem]">Date:</label>
          <p className="w-[32rem]">{order?.createdAt.toDateString()}</p>
        </div>
      </div>
      <Link
        className="border block w-[100%] max-md:w-[50%] m-auto mt-4 rounded p-2 my-2 hover:bg-blue-700 hover:text-white self-center text-center"
        href="/dashboard/orders"
      >
        ... Back to Orders
      </Link>
      <br />
      {order?.status === "Pending" && (
        <OrderFinish id={orderId} status={order?.status} />
      )}
      {isAdmin && <OrderStatusChange id={orderId} status={order?.status} />}
      <OrderProducts
        orderId={orderId}
        productIds={order?.productIds}
        productIdsQuantity={order?.productIdsQuantity}
      />
      <OrderCustomer userId={order?.userId} />
    </div>
  );
};

export default OrderDetailsPage;
