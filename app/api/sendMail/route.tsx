"use server";
import sgMail from "@sendgrid/mail";
import { NextResponse } from "next/server";
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const fetchOrders = async () => {
  const { userId } = auth();
  try {
    const order = await prisma.orders.findMany({
      where: {
        userId: userId,
      },
    });
    console.log(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};

export async function POST(request: Request) {
  fetchOrders();
    const msg = {
      to: "alexander.hergert1989@yahoo.com",
      from: "alexander.hergert1989@gmail.com",
      subject: "Order Confirmation",
      text: "and easy to do anywhere, even with Node.js",
      html: "<strong>and easy to do anywhere, even with Node.js</strong>",
    };
    sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent");
      })
      .catch((error) => {
        console.error(error);
      });
  return NextResponse.json({ message: "Email sent" });
}
