import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const { userId } = auth();

const fetchOrders = async () => {
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
    return [];
  }
  //Fetch data
  try {
    const orders = await prisma.orders.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return orders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  } finally {
    await prisma.$disconnect();
  }
};

const OrdersPage = async () => {
  const orders = await fetchOrders();
  return (
    <div>
      <h1>Orders</h1>
      <br />
      <div className="grid grid-cols-2">
        {orders.map((order) => (
          <Link
            href={`/dashboard/orders/${order.id}`}
            key={order.id}
            className="border"
          >
            <div className="flex gap-4 items-center">
              <label>Order ID:</label>
              <h2>{order.id}</h2>
            </div>
            <div className="flex gap-4 items-center">
              <label>Products IDs:</label>
              <p>{order.productIds.join("/")}</p>
            </div>
            <div className="flex gap-4 items-center">
              <label>Price:</label>
              <p>${order.productIdsPrice.join("/$")}</p>
            </div>
            <div className="flex gap-4 items-center">
              <label>Quantity:</label>
              <p>{order.productIdsQuantity.join("/")}</p>
            </div>
            <div className="flex gap-4 items-center">
              <label>Total Price:</label>
              <p>${order.totalPrice}</p>
            </div>
            <div className="flex gap-4 items-center">
              <label>Date:</label>
              <p>{order.createdAt.toDateString()}</p>
            </div>
          </Link>
        ))}
      </div>
      <Link className="text-blue-500 hover:text-blue-700" href="/dashboard">
        To Dashboard
      </Link>
    </div>
  );
};

export default OrdersPage;
