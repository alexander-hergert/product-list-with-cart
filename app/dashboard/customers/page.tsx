import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import Image from "next/image";
import Filter from "@/components/dashboard/Filter";
import Sort from "@/components/dashboard/Sort";
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
      <h1>Customers</h1>
      <h2>Filter</h2>
      <Filter />
      <h2>Sort</h2>
      <Sort />
      <div className="grid grid-cols-2">
        {customers.map((customer) => (
          <Link href={`/dashboard/customers/${customer.id}`} key={customer.id}>
            <Image
              src={customer.image}
              alt={customer.name}
              width={200}
              height={200}
            />
            <div className="flex gap-4 items-center">
              <label>Username:</label>
              <h2>{customer?.name}</h2>
            </div>
            <div className="flex gap-4 items-center">
              <label>Email:</label>
              <h2>{customer?.email}</h2>
            </div>
            <div className="flex gap-4 items-center">
              <label>Address:</label>
              <h2>{customer?.address}</h2>
            </div>
          </Link>
        ))}
      </div>
      <br />
      <Link className="text-blue-500 hover:text-blue-700" href="/dashboard">
        To Dashboard
      </Link>
    </div>
  );
};

export default CustomersPage;
