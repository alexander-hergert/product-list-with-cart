import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
import { checkIfAdmin } from "@/lib/auth";
import sgMail from "@sendgrid/mail";

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const prisma = new PrismaClient();

export async function POST(request: Request) {
  //Check if user is admin or customer owns this order
  const { userId } = auth();
  const { id, status } = await request.json();
  //Check for users order
  const order = await prisma.orders.findUnique({
    where: {
      id,
    },
  });
  //Return if not admin or order owner
  if (!(await checkIfAdmin(userId)) && order?.userId !== userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log("changing order status");
  try {
    //update order status
    const order = await prisma.orders.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });

    //Find users emailadress
    const user = await prisma.users.findUnique({
      where: {
        id: order.userId,
      },
    });

    type OrderStatus = "Paid" | "Shipped" | "Delivered" | "Cancelled";
    type OrderHtmlTemplates = Record<OrderStatus, string>;

    const orderHtml: OrderHtmlTemplates = {
      //send email to user that order was paid
      Paid: `
            <body>
            <h1>Payment Confirmation</h1>
            <p>We are proud to confirm the payment.</p>
            <p>Your order has been paid and is now being processed.</p>
            <p>The delivery will be made as soon as possible in the next 3 days.</p>
            <p>Order ID: ${order.id}</p>
            <p>Status: ${order.status}</p>
            <p>Product IDs: ${order.productIds.join(", ")}</p>
            <p>Product Quantity: ${order.productIdsQuantity.join(", ")}</p>
            <p>Total Price: ${order.totalPrice}</p>
            <p>Thank you for your purchase! Your order will be shipped soon.</p>
            </body>
        `,
      //send email to user when status changed from paid to shipped
      Shipped: `
            <body>
            <h1>Order Shipped</h1>
            <p>Your order has been shipped and will arrive soon.</p>
            <p>Order ID: ${order.id}</p>
            <p>Status: ${order.status}</p>
            <p>Product IDs: ${order.productIds.join(", ")}</p>
            <p>Product Quantity: ${order.productIdsQuantity.join(", ")}</p>
            <p>Total Price: ${order.totalPrice}</p>
            <p>If you have questions, please contact us.</p>
            </body>
        `,
      //send email to user when status changed from shipped to delivered
      Delivered: `
            <body>
            <h1>Order Delivered</h1>
            <p>Your order has been delivered.</p>
            <p>Order ID: ${order.id}</p>
            <p>Status: ${order.status}</p>
            <p>Product IDs: ${order.productIds.join(", ")}</p>
            <p>Product Quantity: ${order.productIdsQuantity.join(", ")}</p>
            <p>Total Price: ${order.totalPrice}</p>
            <p>We wish you good appetite and hope you purchase again.</p>
            </body>
        `,
      //send email to user when status changed from paid to cancelled
      Cancelled: `
            <body>
            <h1>Order Cancelled</h1>
            <p>Your order has been cancelled.</p>
            <p>Order ID: ${order.id}</p>
            <p>Status: ${order.status}</p>
            <p>Product IDs: ${order.productIds.join(", ")}</p>
            <p>Product Quantity: ${order.productIdsQuantity.join(", ")}</p>
            <p>Total Price: ${order.totalPrice}</p>
            <p>We hope you purchase again soon.</p>
            </body>
        `,
    };

    //recipient must be dynamic in future
    const msg = {
      to: user?.email,
      from: "alexander.hergert1989@gmail.com",
      subject: `Orderstatus Confirmation - ${status as OrderStatus}`,
      html: orderHtml[status as OrderStatus],
    };
    // Send the email if the order is paid
    if (
      (order.id && order.status === "Paid") ||
      order.status === "Shipped" ||
      order.status === "Delivered" ||
      order.status === "Cancelled"
    ) {
      console.log(`sending email orderstatus confirmation - ${status}`);
      console.log(msg);
      sgMail
        .send(msg)
        .then(() => {
          console.log("Email sent");
        })
        .catch((error) => {
          console.error(error);
        });
    }
    return NextResponse.json(order);
  } catch (error) {
    console.error("Error reading request data:", error);
    return NextResponse.json(
      { error: "Failed to read request data" },
      { status: 400 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
