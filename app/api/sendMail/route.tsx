"use server";

import sgMail from "@sendgrid/mail";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const prisma = new PrismaClient();

const fetchOrders = async () => {
  const { userId } = auth();

  if (!userId) return [];

  try {
    const orders = await prisma.orders.findMany({
      where: {
        userId: userId,
      },
    });

    console.log(orders);
    return orders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};

export async function POST(request: Request) {
  const orders = await fetchOrders(); // FIX: await the function

  console.log("Fetched user orders:", orders);

  const msg = {
    to: "alexander.hergert1989@yahoo.com",
    from: "alexander.hergert1989@gmail.com",
    subject: "Order Confirmation",
    text: "Your order summary.",
    html: "<strong>Your order summary.</strong>",
  };

  try {
    await sgMail.send(msg);
    console.log("Email sent");
  } catch (error) {
    console.error("SendGrid error:", error);
  } finally {
    await prisma.$disconnect(); // Best practice
  }

  return NextResponse.json({ message: "Email sent" });
}
