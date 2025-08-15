import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import Image from "next/image";
import Filter from "@/components/Filter";
import Sort from "@/components/Sort";
import { checkIfAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

const fetchCustomers = async (
  username: string | undefined,
  email: string | undefined,
  address: string | undefined,
  order: string | undefined
) => {
  const { userId } = auth();
  //Check if user is admin
  if (!(await checkIfAdmin(userId))) {
    redirect("/dashboard");
  }
  //Fetch data
  try {
    const customers = await prisma.users.findMany({
      where: {
        role: "USER",
        ...(username && {
          name: { contains: username, mode: "insensitive" },
        }),
        ...(email && {
          email: { contains: email, mode: "insensitive" },
        }),
        ...(address && {
          address: { contains: address, mode: "insensitive" },
        }),
      },
      orderBy: {
        ...((order === "usernameAsc" && { name: "asc" }) ||
          (order === "usernameDesc" && { name: "desc" })),
        ...((order === "emailAsc" && { email: "asc" }) ||
          (order === "emailDesc" && { email: "desc" })),
        ...((order === "addressAsc" && { address: "asc" }) ||
          (order === "addressDesc" && { address: "desc" })),
      },
    });
    return customers;
  } catch (error) {
    console.error("Error fetching customers:", error);
    return [];
  } finally {
    await prisma.$disconnect();
  }
};

type SearchParams = {
  username?: string;
  email?: string;
  address?: string;
  order?: string;
};

const CustomersPage = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}) => {
  const { username, email, address, order } = searchParams;
  const customers = await fetchCustomers(username, email, address, order);
  return (
    <div>
      <div className="mt-4 gap-4 flex flex-wrap justify-center m-auto max-lg:flex-col max-md:w-[327px]">
        <div>
          <Filter isAdmin={false} />
        </div>
        <div>
          <Sort isAdmin={false} />
        </div>
      </div>
      <h1 className="text-2xl text-center mt-4 font-bold">Customers</h1>
      <div
        className="grid grid-cols-3 place-items-center m-auto w-full mt-4 max-lg:grid-cols-2 max-md:grid-cols-1 
      max-lg:w-[800px] max-md:w-[400px] gap-4"
      >
        {customers.map((customer) => (
          <Link
            href={`/dashboard/customers/${customer.id}`}
            key={customer.id}
            className="border rounded-xl shadow-md"
          >
            <div className="w-[300px]">
              <Image
                className="rounded-t-xl w-[300px] h-[300px] object-cover m-auto"
                src={customer.image}
                alt={customer.name}
                width={300}
                height={300}
              />
            </div>
            <div className="p-2">
              <div className="flex items-center max-w-[250px]">
                <label className="w-[100px]">Username:</label>
                <h2 className="truncate w-[150px]">{customer?.name}</h2>
              </div>
              <div className="flex items-center max-w-[250px]">
                <label className="w-[100px]">Email:</label>
                <h2 className="truncate w-[150px]">{customer?.email}</h2>
              </div>
              <div className="flex items-center max-w-[250px]">
                <label className="w-[100px]">Address:</label>
                <h2 className="truncate w-[150px]">{customer?.address}</h2>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <Link
        className="border block w-[20%] max-lg:w-[50%] m-auto mt-4 rounded p-2 my-2 hover:bg-blue-700 hover:text-white self-center text-center"
        href="/dashboard"
      >
        ... Back to Dashboard
      </Link>
    </div>
  );
};

export default CustomersPage;
