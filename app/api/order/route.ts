"use server";
import sgMail from "@sendgrid/mail";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const orderSchema = z.object({
  id: z.string(),
  userId: z.string(),
  productIds: z
    .array(z.string())
    .nonempty("Product IDs cannot be an empty array"),
  productIdsQuantity: z
    .array(z.number().int().min(1, "Quantity must be at least 1"))
    .nonempty("Product quantity cannot be empty"),
  productIdsPrice: z
    .array(z.number().positive("Price must be a positive number"))
    .nonempty("Product price array cannot be empty"),
  totalPrice: z.number().positive("Total price must be a positive number"),
});

const uniqueId = uuidv4();

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const clerkUser = userId ? await clerkClient().users.getUser(userId) : null;
    const cart = await request.json();

    const id = uuidv4();
    const productNames = Object.keys(cart).map((id) => cart[id].name);
    const productIds = Object.keys(cart);
    const productIdsQuantity = Object.keys(cart).map((id) => cart[id].quantity);
    const productIdsPrice = Object.keys(cart).map((id) => cart[id].price);
    const totalPrice = Object.keys(cart).reduce((acc, id) => {
      return acc + cart[id].price * cart[id].quantity;
    }, 0);

    // Validate the order
    try {
      const orderValidate = orderSchema.parse({
        id,
        userId,
        productIds,
        productIdsQuantity,
        productIdsPrice,
        totalPrice,
      });
    } catch (error) {
      console.error("Error validating order:", error);
      return NextResponse.json(
        { error: "Failed to validate order" },
        { status: 400 }
      );
    }

    // Create a new order in the database
    const order = await prisma.orders.create({
      data: {
        id,
        userId,
        productIds,
        productIdsQuantity,
        productIdsPrice,
        totalPrice,
      },
    });

    // Send an email to the user
    const orderHtml = `
      <body>
        <h1>Your order is on the way!</h1>
        <p><strong>Order ID:</strong> ${order.id}</p>
        <p><strong>Productnames: ${productNames}</p>
        <p><strong>Product Quantity:</strong> ${order.productIdsQuantity}</p>
        <p><strong>Product Pricing:</strong> ${order.productIdsPrice}</p>
        <p><strong>Total Price:</strong> ${order.totalPrice} USD</p>
        <p>Thank you for shopping with us!</p>
      </body>
  `;
    const msg = {
      to: "alexander.hergert1989@yahoo.com",
      from: "alexander.hergert1989@gmail.com",
      subject: "Order Confirmation",
      html: orderHtml,
    };
    sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent");
      })
      .catch((error) => {
        console.error(error);
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
