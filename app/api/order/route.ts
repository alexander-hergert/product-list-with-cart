import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from "uuid";

const uniqueId = uuidv4();
console.log(uniqueId); // Outputs something like '6f1b44d2-5d90-4f6b-bc8c-dbf09b7747e5'

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const clerkUser = userId ? await clerkClient().users.getUser(userId) : null;
    const name = clerkUser?.fullName || "Unknown";
    const email = clerkUser?.emailAddresses[0]?.emailAddress || "Unknown";
    const cart = await request.json();
    const id = uuidv4();
    const productIds = Object.keys(cart);
    const productIdsQuantity = Object.keys(cart).map((id) => cart[id].quantity);
    const productIdsPrice = Object.keys(cart).map((id) => cart[id].price);
    const totalPrice = Object.keys(cart).reduce((acc, id) => {
      return acc + cart[id].price * cart[id].quantity;
    }, 0);

    // Create a new order in the database
    const order = await prisma.orders.create({
      data: {
        id,
        userId,
        name,
        email,
        productIds,
        productIdsQuantity,
        productIdsPrice,
        totalPrice,
      },
    });
  } catch (error) {
    console.error("Error getting user:", error);
    return NextResponse.json({ error: "Failed to get user" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }

  return NextResponse.json(
    { message: "Order sent successfully" },
    { status: 200 }
  );
}
