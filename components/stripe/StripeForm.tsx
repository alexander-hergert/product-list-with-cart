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

  const cartCtx = useContext(CartContext);
  if (!cartCtx) {
    return <div>Error: CartContext is not available.</div>;
  }
  const { cart, setCart } = cartCtx;

  const orderIdCtx = useContext(OrderIdContext);
  if (!orderIdCtx) {
    return <div>Error: OrderIdContext is not available.</div>;
  }
  const { orderId } = orderIdCtx;

  const router = useRouter();

  React.useEffect(() => {
    const secret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (secret) {
      setConfirmed(true);
      if (!clientSecret) {
        setClientSecret(secret);
      }
    }
  }, [clientSecret]);


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
  }, [orderId]);

  const appearance = { theme: "stripe" } as const;

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
