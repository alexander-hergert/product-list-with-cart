import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { OrderStatus } from "@/lib/types";
import { truncateToUTCDateStart, truncateToUTCDateEnd } from "@/lib/utils";
import Filter from "@/components/dashboard/Filter";
import Sort from "@/components/dashboard/Sort";
import { checkIfAdmin } from "@/lib/auth";

const prisma = new PrismaClient();

const fetchOrders = async (
  status: OrderStatus | undefined,
  minDate: string | undefined,
  maxDate: string | undefined,
  minTotalPrice: string | undefined,
  maxTotalPrice: string | undefined,
  order: string | undefined
) => {
  const { userId } = auth();
  //Check if user is admin
  const isAdmin = await checkIfAdmin(userId);

  //Fetch data
  try {
    const orders = await prisma.orders.findMany({
      where: {
        userId: (!isAdmin && userId) || undefined,
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
      <div className="m-auto max-lg:flex-col max-md:w-[327px]">
        <div>
          <h2 className="text-2xl text-center">Filter</h2>
          <Filter />
        </div>
        <div>
          <h2 className="text-2xl text-center">Sort</h2>
          <Sort />
        </div>
      </div>
      <div
        className="m-auto w-[1200px] mt-4 grid grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 
      max-lg:w-[800px] max-md:w-[400px] gap-4"
      >
        {orders.map((order) => (
          <Link
            href={`/dashboard/orders/${order.id}`}
            key={order.id}
            className="border p-2 rounded-xl"
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
