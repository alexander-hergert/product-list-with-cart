import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
import { checkIfAdmin } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  //Check if user is admin
  const { userId } = auth();
  if (!(await checkIfAdmin(userId))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  console.log("changing order status");
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
