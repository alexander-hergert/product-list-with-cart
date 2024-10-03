import Link from "next/link";
import Customers from "@/components/dashboard/Customers";
import Orders from "@/components/dashboard/Orders";
import Feedback from "@/components/dashboard/Feedbacks";
import Products from "@/components/dashboard/Products";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { DashboardData } from "@/lib/types";

const prisma = new PrismaClient();
const { userId } = auth();

const getDashboardData = async (): Promise<DashboardData> => {
  try {
    const customers = await prisma.users.findMany({
      where: {
        role: "USER",
      },
      orderBy: {
        name: "asc",
      },
      take: 3,
    });
    const products = await prisma.products.findMany({
      orderBy: {
        id: "asc",
      },
      take: 3,
    });
    const orders = await prisma.orders.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 3,
    });
    const feedbacks = await prisma.feedbacks.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 3,
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

const DashboardPage = async () => {
  const data = await getDashboardData();
  const { customers, products, orders, feedbacks } = data;
  return (
    <div>
      <h1>Dashboard</h1>
      <Customers customers={customers} />
      <Products products={products} />
      <Orders orders={orders} />
      <Feedback feedbacks={feedbacks} />
      <br />
      <Link href="/">To Home</Link>
    </div>
  );
};

export default DashboardPage;
