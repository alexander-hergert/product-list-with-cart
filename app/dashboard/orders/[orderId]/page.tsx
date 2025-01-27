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

  return (
    <div className="m-auto max-w-[600px] max:md:max-w-[327px]">
      <h1 className="text-2xl text-center">Order Details</h1>
      <div>
        <div className="flex gap-4 items-center">
          <label>Order ID:</label>
          <h2>{order?.id}</h2>
        </div>
        <div className="flex gap-4 items-center">
          <label>Products IDs:</label>
          <p>{order?.productIds.join("/")}</p>
        </div>
        <div className="flex gap-4 items-center">
          <label>Price:</label>
          <p>${order?.productIdsPrice.join("/$")}</p>
        </div>
        <div className="flex gap-4 items-center">
          <label>Quantity:</label>
          <p>{order?.productIdsQuantity.join("/")}</p>
        </div>
        <div className="flex gap-4 items-center">
          <label>Total Price:</label>
          <p>${order?.totalPrice}</p>
        </div>
        <div className="flex gap-4 items-center">
          <label>Date:</label>
          <p>{order?.createdAt.toDateString()}</p>
        </div>
      </div>
      <Link
        className="text-blue-500 hover:text-blue-700"
        href="/dashboard/orders"
      >
        ... Back to Orders
      </Link>
      <br />
      {order?.status === "Pending" && (
        <OrderFinish id={orderId} status={order?.status} />
      )}
      <OrderStatusChange id={orderId} status={order?.status} />
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
