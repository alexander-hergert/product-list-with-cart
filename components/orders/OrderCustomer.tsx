import { FC } from "react";
import { PrismaClient } from "@prisma/client";
import { User } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

const prisma = new PrismaClient();

interface OrderCustomerProps {
  userId: string | undefined;
}

const OrderCustomer: FC<OrderCustomerProps> = async ({ userId }) => {
  let user: User | null = null;
  try {
    user = await prisma.users.findUnique({
      where: {
        id: userId,
      },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
  } finally {
    await prisma.$disconnect();
  }
  return (
    <div>
      <Link
        href={`/dashboard/customers/${userId}`}
        className="border rounded-xl flex items-center justify-between 
              max-md:flex-col max-md:m-auto max-md:w-[327px] shadow-md hover:shadow-lg transition-shadow duration-200"
      >
        {user && (
          <Image
            className="md:rounded-l-xl max-md:w-full max-md:rounded-t-xl"
            src={user?.image}
            alt={user?.name}
            width={250}
            height={250}
          />
        )}
        <div className="m-auto max-md:m-0 max-md:my-4">
          <h2 className="text-xl">Customer Details</h2>
          <p>Name: {user?.name}</p>
          <p>Email: {user?.email}</p>
          <p>Address: {user?.address}</p>
        </div>
      </Link>
    </div>
  );
};

export default OrderCustomer;
