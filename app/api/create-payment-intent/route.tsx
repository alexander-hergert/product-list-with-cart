// This is your test secret API key.
import Stripe from "stripe";
import { NextResponse } from "next/server";
import { Cart } from "@/lib/types";
import { PrismaClient } from "@prisma/client";

const secretKey = process.env.STRIPE_SECRET_KEY;
const stripe = secretKey ? new Stripe(secretKey) : undefined;

const calculateOrderAmount = (cart) => {
  const totalPrice = Object.keys(cart).reduce((acc, id) => {
    return acc + parseFloat(cart[id].price) * parseInt(cart[id].quantity);
  }, 0);

  return Math.round(totalPrice * 100);
};

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const req = await request.json();
  const { cart, orderId } = req as { cart: Cart; orderId: string };

  //Check db for orderId
  const order = await prisma.orders.findUnique({
    where: {
      id: orderId,
    },
  });
  const paymentIntentId = order?.paymentId;
  console.log("order", order);

  if (order?.paymentId) {
    try {
      const paymentIntent = await stripe?.paymentIntents.retrieve(
        paymentIntentId
      );
      return NextResponse.json({
        clientSecret: paymentIntent?.client_secret,
      });
    } catch (error) {
      console.error("Error fetching order:", error);
      return NextResponse.json(
        { error: "Failed to fetch order" },
        { status: 500 }
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  if (!order?.paymentId) {
    try {
      //Create a PaymentIntent with the order amount and currency
      const paymentIntent = await stripe?.paymentIntents.create({
        amount: calculateOrderAmount(cart),
        currency: "eur",
        // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
        automatic_payment_methods: {
          enabled: true,
        },
      });

      try {
        // Update the order in the database
        await prisma.orders.update({
          where: {
            id: orderId,
          },
          data: {
            paymentId: paymentIntent?.id,
          },
        });
      } catch (error) {
        console.error("Error updating order:", error);
      } finally {
        await prisma.$disconnect();
      }

      return NextResponse.json({
        clientSecret: paymentIntent?.client_secret,
        // [DEV]: For demo purposes only, you should avoid exposing the PaymentIntent ID in the client-side code.
        dpmCheckerLink: `https://dashboard.stripe.com/settings/payment_methods/review?transaction_id=${paymentIntent.id}`,
      });
    } catch (error) {
      console.error("Error creating PaymentIntent:", error);
      return NextResponse.json(
        { error: "Failed to create PaymentIntent" },
        { status: 500 }
      );
    }
  }
}
