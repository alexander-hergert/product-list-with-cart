import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import dynamic from "next/dynamic";
import { PrismaClient } from "@prisma/client";
import OrderProducts from "@/components/orders/OrderProducts";
import OrderCustomer from "@/components/orders/OrderCustomer";
import { checkIfAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";

const OrderChangeStatus = dynamic(
  () => import("@/components/orders/OrderStatusChange"),
  {
    ssr: false,
  }
);

const prisma = new PrismaClient();

const fetchOrder = async (id: string) => {
  const { userId } = auth();
  //Check if user is admin
  if (!(await checkIfAdmin(userId))) {
    redirect("/dashboard");
  }
  //Fetch data
  try {
    const order = await prisma.orders.findUnique({
      where: {
        id,
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
    <div>
      <h1>Order Details</h1>
      <br />
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
      <OrderChangeStatus id={orderId} status={order?.status} />
      <OrderProducts orderId={orderId} productIds={order?.productIds} productIdsQuantity={order?.productIdsQuantity}/>
      <OrderCustomer userId={order?.userId} />
    </div>
  );
};

export default OrderDetailsPage;
