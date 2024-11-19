"use client";
import React, { useContext } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { CartContext } from "@/lib/cartContext";

import CheckoutForm from "@/components/stripe/CheckoutForm";
import CompletePage from "@/components/stripe/CompletePage";
import { set } from "zod";

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
    if (Object.keys(cart).length === 0) {
      // Don't proceed if the cart is empty
      console.log("Cart is empty. No PaymentIntent created.");
      return;
    }

    // Create PaymentIntent when cart is not empty
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cart }),
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
  }, [cart]);

  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="App">
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          {confirmed ? (
            <CompletePage />
          ) : (
            <CheckoutForm dpmCheckerLink={dpmCheckerLink} />
          )}
        </Elements>
      )}
    </div>
  );
}
