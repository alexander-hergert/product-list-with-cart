// This is your test secret API key.
import Stripe from "stripe";
import { NextResponse } from "next/server";
import { Cart } from "@/lib/types";

const secretKey = process.env.STRIPE_SECRET_KEY;
const stripe = secretKey ? new Stripe(secretKey) : undefined;

const calculateOrderAmount = (cart) => {
  const totalPrice = Object.keys(cart).reduce((acc, id) => {
    return acc + parseFloat(cart[id].price) * parseInt(cart[id].quantity);
  }, 0);

  return Math.round(totalPrice * 100);
};

export async function POST(request: Request) {
  const { cart } = await request.json();

  try {
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe?.paymentIntents.create({
      amount: calculateOrderAmount(cart),
      currency: "eur",
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {
        enabled: true,
      },
    });

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
