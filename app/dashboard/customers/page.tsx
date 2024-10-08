import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import Image from "next/image";

const prisma = new PrismaClient();
const { userId } = auth();

const fetchCustomers = async () => {
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
    return [];
  }
  //Fetch data
  try {
    const customers = await prisma.users.findMany({
      where: {
        role: "USER",
      },
      orderBy: {
        name: "asc",
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

const CustomersPage = async () => {
  const customers = await fetchCustomers();
  return (
    <div>
      <h1>Customers</h1>
      <br />
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
