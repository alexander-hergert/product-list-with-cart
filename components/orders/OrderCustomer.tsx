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
      <Link href={`/dashboard/customers/${userId}`}>
        <h2>Customer Details</h2>
        {user && (
          <Image src={user?.image} alt={user?.name} width={100} height={100} />
        )}
        <p>Name: {user?.name}</p>
        <p>Email: {user?.email}</p>
        <p>Address: {user?.address}</p>
      </Link>
    </div>
  );
};

export default OrderCustomer;
