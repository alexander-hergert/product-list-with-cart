import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const fetchOrder = async (id: string) => {
  const { userId } = auth();
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
    return null;
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
  id: string;
}

const OrderDetailsPage = async ({ params }: { params: Params }) => {
  const { id } = params;
  const order = await fetchOrder(id);

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
    </div>
  );
};

export default OrderDetailsPage;
