import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { OrderStatus } from "@/lib/types";
import { truncateToUTCDateStart, truncateToUTCDateEnd } from "@/lib/utils";
import Filter from "@/components/dashboard/Filter";
import Sort from "@/components/dashboard/Sort";

const prisma = new PrismaClient();
const { userId } = auth();

const fetchOrders = async (
  status: OrderStatus | undefined,
  minDate: string | undefined,
  maxDate: string | undefined,
  minTotalPrice: string | undefined,
  maxTotalPrice: string | undefined,
  order: string | undefined
) => {
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
      where: {
        ...(status && { status }),
        totalPrice: {
          ...(minTotalPrice && { gte: Number(minTotalPrice) }),
          ...(maxTotalPrice && { lte: Number(maxTotalPrice) }),
        },
        createdAt: {
          ...(minDate && { gte: truncateToUTCDateStart(minDate) }),
          ...(maxDate && { lte: truncateToUTCDateEnd(maxDate) }),
        },
      },
      orderBy: {
        ...((order === "dateAsc" && { createdAt: "asc" }) ||
          (order === "dateDesc" && { createdAt: "desc" })),
        ...((order === "totalPriceAsc" && { totalPrice: "asc" }) ||
          (order === "totalPriceDesc" && { totalPrice: "desc" })),
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

type SearchParams = {
  status?: OrderStatus;
  minDate?: string;
  maxDate?: string;
  minTotalPrice?: string;
  maxTotalPrice?: string;
  order?: string;
};

const OrdersPage = async ({ searchParams }: { searchParams: SearchParams }) => {
  const { status, minDate, maxDate, minTotalPrice, maxTotalPrice, order } =
    searchParams;
  const orders = await fetchOrders(
    status,
    minDate,
    maxDate,
    minTotalPrice,
    maxTotalPrice,
    order
  );
  return (
    <div>
      <h1>Orders</h1>
      <h2>Filter</h2>
      <Filter />
      <h2>Sort</h2>
      <Sort />
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
            <div className="flex gap-4 items-center">
              <label>Status:</label>
              <p>{order.status}</p>
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
