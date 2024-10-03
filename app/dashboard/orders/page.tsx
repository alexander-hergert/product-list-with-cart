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
          <Link href={`/dashboard/orders/${order.id}`} key={order.id} className="border">
            <h2>{order.id}</h2>
            <p>{order.productIds}</p>
            <p>{order.productIdsPrice}</p>
            <p>{order.productIdsQuantity}</p>
            <p>{order.totalPrice}</p>
            <p>{order.createdAt.toDateString()}</p>
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
