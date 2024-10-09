import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth, clerkClient } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { userId } = auth();

  // Check if user is admin
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
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    //read request data
    const { id, status } = await request.json();
    //update order status
    const order = await prisma.orders.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });
    return NextResponse.json(order);
  } catch (error) {
    console.error("Error reading request data:", error);
    return NextResponse.json(
      { error: "Failed to read request data" },
      { status: 400 }
    );
  }
}
