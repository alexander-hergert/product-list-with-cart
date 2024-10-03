import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import Image from "next/image";

const prisma = new PrismaClient();

const fetchCustomer = async (id: string) => {
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
    const customer = await prisma.users.findUnique({
      where: {
        id,
      },
    });
    return customer;
  } catch (error) {
    console.error("Error fetching customer:", error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
};
interface Params {
  id: string;
}

const ProductDetailsPage = async ({ params }: { params: Params }) => {
  const { id } = params;
  const customer = await fetchCustomer(id);
  return (
    <div>
      <h1>Customer Details</h1>
      <br />
      <div>
        <Image
          src={customer ? customer.image : ""}
          alt={customer ? customer.name : ""}
          width={200}
          height={200}
        />
        <h2>{customer?.name}</h2>
        <p>{customer?.email}</p>
        <p>{customer?.address}</p>
      </div>
      <Link
        className="text-blue-500 hover:text-blue-700"
        href="/dashboard/customers"
      >
        ... Back to Customers
      </Link>
    </div>
  );
};

export default ProductDetailsPage;
