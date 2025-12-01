"use client";
import React, { useContext } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { CartContext } from "@/lib/cartContext";
import { OrderIdContext } from "@/lib/orderIdContext";
import { useRouter } from "next/navigation";

import CheckoutForm from "@/components/stripe/CheckoutForm";
import CompletePage from "@/components/stripe/CompletePage";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function StripeForm() {
  const [clientSecret, setClientSecret] = React.useState("");
  const [dpmCheckerLink, setDpmCheckerLink] = React.useState("");
  const [confirmed, setConfirmed] = React.useState(false);

  const { cart, setCart } = useContext(CartContext);
  const { orderId } = useContext(OrderIdContext);

  const router = useRouter();

  // Fix 1 — Prevent infinite loops
  React.useEffect(() => {
    const secret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (secret) {
      setConfirmed(secret);

      if (!clientSecret) {
        setClientSecret(secret);
      }
    }
  }, [clientSecret]);

  // Fix 2 — Correct dependency logic for payment intent creation
  React.useEffect(() => {
    if (!orderId || !cart) return;

    const createIntent = async () => {
      try {
        const res = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cart, orderId }),
        });

        const data = await res.json();

        setClientSecret(data.clientSecret);
        setCart({});
        localStorage.setItem("cart", JSON.stringify({}));

        setDpmCheckerLink(data.dpmCheckerLink);
      } catch (err) {
        console.error("Error creating PaymentIntent:", err);
      }
    };

    createIntent();
  }, [orderId]); // Only re-run when order is created

  const appearance = { theme: "stripe" };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <section className="App m-4">
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          {confirmed ? (
            <CompletePage />
          ) : (
            <CheckoutForm dpmCheckerLink={dpmCheckerLink} />
          )}
        </Elements>
      )}
    </section>
  );
}
