import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import Image from "next/image";
import { checkIfAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

const fetchCustomer = async (id: string) => {
  const { userId } = auth();
  //Check if user is admin
  if (!(await checkIfAdmin(userId))) {
    redirect("/dashboard");
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
      <h1 className="text-2xl mb-4 text-center">Customer Details</h1>
      <div className="flex flex-col items-center border rounded-xl p-4 shadow-md md:min-w-[600px] md:w-1/4 m-auto max-md:w-[80%]">
        <div>
          <Image
            className="rounded-xl"
            src={customer ? customer.image : ""}
            alt={customer ? customer.name : ""}
            width={300}
            height={300}
          />
          <div className="flex gap-4 items-center max-md:flex-col text-center my-4">
            <label>Username:</label>
            <h2>{customer?.name}</h2>
          </div>
          <div className="flex gap-4 items-center max-md:flex-col text-center my-4">
            <label>Email:</label>
            <h2>{customer?.email}</h2>
          </div>
          <div className="flex gap-4 items-center max-md:flex-col text-center my-4">
            <label>Address:</label>
            <h2>{customer?.address}</h2>
          </div>
        </div>
        <Link
          className="text-blue-500 hover:text-blue-700"
          href="/dashboard/customers"
        >
          ... Back to Customers
        </Link>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
