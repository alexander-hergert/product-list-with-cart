// This is your test secret API key.
import Stripe from "stripe";
import { NextResponse } from "next/server";
import { Cart } from "@/lib/types";
import { PrismaClient } from "@prisma/client";

const secretKey = process.env.STRIPE_SECRET_KEY;
const stripe = secretKey ? new Stripe(secretKey) : undefined;

// Strong typing for cart calculation
const calculateOrderAmount = (
  cart: Record<string, { price: number; quantity: number }>
) => {
  const totalPrice = Object.keys(cart).reduce((acc, id) => {
    return acc + cart[id].price * cart[id].quantity;
  }, 0);

  return Math.round(totalPrice * 100); // Stripe uses cents
};

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const req = await request.json();

  // Strongly typed request payload
  const { cart, orderId } = req as { cart: Cart; orderId: string };

  // Validate that stripe is initialized
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe secret key missing" },
      { status: 500 }
    );
  }

  // Check db for the order
  const order = await prisma.orders.findUnique({
    where: {
      id: orderId,
    },
  });

  const paymentIntentId = order?.paymentId;

  if (paymentIntentId) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntentId
      );

      return NextResponse.json({
        clientSecret: paymentIntent.client_secret,
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

  // No payment intent exists → create new
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(cart),
      currency: "eur",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    try {
      await prisma.orders.update({
        where: {
          id: orderId,
        },
        data: {
          paymentId: paymentIntent.id,
        },
      });
    } catch (error) {
      console.error("Error updating order:", error);
    } finally {
      await prisma.$disconnect();
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
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
