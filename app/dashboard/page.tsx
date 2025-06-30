import Link from "next/link";
import Customers from "@/components/dashboard/Customers";
import Orders from "@/components/dashboard/Orders";
import Feedback from "@/components/dashboard/Feedbacks";
import Products from "@/components/dashboard/Products";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { DashboardData } from "@/lib/types";
import { checkIfAdmin } from "@/lib/auth";

const prisma = new PrismaClient();

const DashboardPage = async () => {
  const { userId } = auth();
  //Check if user is admin
  const isAdmin = await checkIfAdmin(userId);
  const getDashboardData = async (): Promise<DashboardData> => {
    //Fetch data
    try {
      const customers = isAdmin
        ? await prisma.users.findMany({
            where: {
              role: "USER",
            },
            orderBy: {
              name: "asc",
            },
            take: 7,
          })
        : [];
      const products = isAdmin
        ? await prisma.products.findMany({
            orderBy: {
              id: "asc",
            },
            take: 7,
          })
        : [];
      const orders = isAdmin
        ? await prisma.orders.findMany({
            orderBy: {
              createdAt: "desc",
            },
            take: 4,
          })
        : await prisma.orders.findMany({
            where: {
              userId: userId || "",
            },
            orderBy: {
              createdAt: "desc",
            },
            take: 4,
          });
      const feedbacks = isAdmin
        ? await prisma.feedbacks.findMany({
            orderBy: {
              createdAt: "desc",
            },
            take: 7,
          })
        : await prisma.feedbacks.findMany({
            where: {
              userId: userId || "",
            },
            orderBy: {
              createdAt: "desc",
            },
            take: 7,
          });

      return {
        customers,
        products,
        orders,
        feedbacks,
      };
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      return {
        customers: [],
        products: [],
        orders: [],
        feedbacks: [],
      };
    } finally {
      await prisma.$disconnect();
    }
  };
  const data = await getDashboardData();
  const { customers, products, orders, feedbacks } = data;
  return (
    <div className="grid place-content-center">
      <h1 className="text-2xl my-4 font-bold text-center">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 lg:w-[800px] max-lg:min-w-[360px] max-lg:grid-cols-1">
        {isAdmin && <Customers customers={customers} />}
        {isAdmin && <Products products={products} />}
        <Orders orders={orders} />
        <Feedback feedbacks={feedbacks} />
      </div>
      <Link
        className="text-blue-500 hover:text-blue-700 mt-4 text-center"
        href="/"
      >
        To Home
      </Link>
    </div>
  );
};

export default DashboardPage;
