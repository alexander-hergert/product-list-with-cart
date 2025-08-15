import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import type { OrderStatus } from "@prisma/client";
import { truncateToUTCDateStart, truncateToUTCDateEnd } from "@/lib/utils";
import Filter from "@/components/Filter";
import Sort from "@/components/Sort";
import { checkIfAdmin } from "@/lib/auth";

const prisma = new PrismaClient();

const fetchOrders = async (
  id: string | undefined,
  username: string | undefined,
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
    //Fetch queried user
    const queriedUser = await prisma.users.findMany({
      where: {
        name: {
          contains: username,
          mode: "insensitive",
        },
      },
    });
    const orders = await prisma.orders.findMany({
      where: {
        userId:
          (isAdmin ? { in: queriedUser.map((user) => user.id) } : userId) ||
          undefined,
        ...(status && { status }),
        totalPrice: {
          ...(minTotalPrice && { gte: Number(minTotalPrice) }),
          ...(maxTotalPrice && { lte: Number(maxTotalPrice) }),
        },
        createdAt: {
          ...(minDate && { gte: truncateToUTCDateStart(minDate) }),
          ...(maxDate && { lte: truncateToUTCDateEnd(maxDate) }),
        },
        ...(id && { id: { contains: id, mode: "insensitive" } }),
      },
      orderBy: {
        ...((order === "usernameAsc" && { user: { name: "asc" } }) ||
          (order === "usernameDesc" && { user: { name: "desc" } })),
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
  id?: string;
  username?: string;
  status?: OrderStatus;
  minDate?: string;
  maxDate?: string;
  minTotalPrice?: string;
  maxTotalPrice?: string;
  order?: string;
};

const OrdersPage = async ({ searchParams }: { searchParams: SearchParams }) => {
  const { userId } = auth();
  const isAdmin = await checkIfAdmin(userId);
  const {
    id,
    username,
    status,
    minDate,
    maxDate,
    minTotalPrice,
    maxTotalPrice,
    order,
  } = searchParams;
  const orders = await fetchOrders(
    id,
    username,
    status,
    minDate,
    maxDate,
    minTotalPrice,
    maxTotalPrice,
    order
  );
  return (
    <div>
      <div className="mt-4 gap-4 flex justify-center m-auto max-lg:flex-col max-md:w-[327px] flex-wrap">
        <div>
          <Filter isAdmin={isAdmin} />
        </div>
        <div>
          <Sort isAdmin={isAdmin} />
        </div>
      </div>
      <h1 className="text-2xl text-center mt-4 font-bold">Orders</h1>
      <div
        className="m-auto w-[1200px] mt-4 grid grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 
      max-lg:w-[800px] max-md:w-[400px] gap-4"
      >
        {orders.map((order) => (
          <Link
            href={`/dashboard/orders/${order.id}`}
            key={order.id}
            className="border p-2 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex gap-4 items-start">
              <label className="w-[6rem]">Order ID:</label>
              <h2 className="w-[18rem]">{order.id}</h2>
            </div>
            <div className="flex gap-4 items-start my-4">
              <label className="w-[6rem]">Products IDs:</label>
              <ul className="w-[18rem] list-disc">
                {order?.productIds.map((productId, index) => (
                  <li key={index}>{productId}</li>
                ))}
              </ul>
            </div>
            <div className="flex gap-4 items-start">
              <label className="w-[6rem]">Price:</label>
              <ul className="w-[18rem] list-disc">
                {order?.productIdsPrice.map((productIdPrice, index) => (
                  <li key={index}>${productIdPrice}</li>
                ))}
              </ul>
            </div>
            <div className="flex gap-4 items-start my-4">
              <label className="w-[6rem]">Quantity:</label>
              <ul className="w-[18rem] list-disc">
                {order?.productIdsQuantity.map((productIdQuantity, index) => (
                  <li key={index}>{productIdQuantity}</li>
                ))}
              </ul>
            </div>
            <div className="flex gap-4 items-start">
              <label className="w-[6rem]">Total Price:</label>
              <p className="w-[18rem]">${order.totalPrice}</p>
            </div>
            <div className="flex gap-4 items-start">
              <label className="w-[6rem]">Date:</label>
              <p className="w-[18rem]">{order.createdAt.toDateString()}</p>
            </div>
            <div className="flex gap-4 items-start">
              <label className="w-[6rem]">Status:</label>
              <p className="w-[18rem]">{order.status}</p>
            </div>
          </Link>
        ))}
      </div>
      <Link
        className="border block w-[20%] max-md:w-[50%] m-auto mt-4 rounded p-2 my-2 hover:bg-blue-700 hover:text-white self-center text-center"
        href="/dashboard"
      >
        ... Back to Dashboard
      </Link>
    </div>
  );
};

export default OrdersPage;
