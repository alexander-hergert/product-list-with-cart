"use client";
import React, { useContext } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { CartContext } from "@/lib/cartContext";
import { OrderIdContext } from "@/lib/orderIdContext";
import { useRouter } from "next/navigation";

import CheckoutForm from "@/components/stripe/CheckoutForm";
import CompletePage from "@/components/stripe/CompletePage";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function StripeForm() {
  const [clientSecret, setClientSecret] = React.useState("");
  const [dpmCheckerLink, setDpmCheckerLink] = React.useState("");
  const [confirmed, setConfirmed] = React.useState(false);
  const { cart, setCart } = useContext(CartContext);
  const { orderId } = useContext(OrderIdContext);
  const router = useRouter();

  React.useEffect(() => {
    setConfirmed(
      new URLSearchParams(window.location.search).get(
        "payment_intent_client_secret"
      )
    );
    if (!clientSecret) {
      setClientSecret(
        new URLSearchParams(window.location.search).get(
          "payment_intent_client_secret"
        )
      );
    }
  });

  React.useEffect(() => {
    if (!orderId) {
      // Don't proceed if no active order
      //router.push("/");
      return;
    }

    // Create PaymentIntent when cart is not empty
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cart, orderId }),
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
        setCart({}); // Clear cart after processing
        localStorage.setItem("cart", JSON.stringify({}));
        // [DEV] For demo purposes only
        setDpmCheckerLink(data.dpmCheckerLink);
      })
      .catch((err) => console.error("Error creating PaymentIntent:", err));
  }, []);

  const appearance = {
    theme: "stripe",
  };
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
