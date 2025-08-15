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
    <>
      <div>
        <h1 className="text-2xl my-4 text-center font-bold">
          Customer Details
        </h1>
        <div className="flex flex-col items-center border rounded-xl p-4 shadow-md md:min-w-[600px] md:w-1/4 m-auto max-md:w-[80%]">
          <div>
            <Image
              className="rounded-xl w-[300px] h-[300px] object-cover m-auto"
              src={customer ? customer.image : ""}
              alt={customer ? customer.name : ""}
              width={300}
              height={300}
            />
            <div className="flex items-center max-md:flex-col my-4 max-md:text-center">
              <label className="w-[100px]">Username:</label>
              <h2>{customer?.name}</h2>
            </div>
            <div className="flex items-center max-md:flex-col my-4 max-md:text-center">
              <label className="w-[100px]">Email:</label>
              <h2>{customer?.email}</h2>
            </div>
            <div className="flex items-center max-md:flex-col my-4 max-md:text-center">
              <label className="w-[100px]">Address:</label>
              <h2>{customer?.address}</h2>
            </div>
          </div>
          <Link
            className="border block w-[50%] max-md:w-[50%] m-auto mt-4 rounded p-2 my-2 hover:bg-blue-700 hover:text-white self-center text-center"
            href="/dashboard/customers"
          >
            ... Back to Customers
          </Link>
        </div>
      </div>
      <div className="flex gap-4 md:min-w-[600px] md:w-1/4 m-auto max-md:w-[80%]">
        <Link
          className="border block w-[50%] max-md:w-[50%] m-auto mt-4 rounded p-2 my-2 hover:bg-blue-700 hover:text-white self-center text-center"
          href={`/dashboard/feedback?username=${customer?.name}`}
        >
          ... To Feedbacks
        </Link>
        <Link
          className="border block w-[50%] max-md:w-[50%] m-auto mt-4 rounded p-2 my-2 hover:bg-blue-700 hover:text-white self-center text-center"
          href={`/dashboard/orders?username=${customer?.name}`}
        >
          ... To Orders
        </Link>
      </div>
    </>
  );
};

export default ProductDetailsPage;
