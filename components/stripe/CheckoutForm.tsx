import React, { useContext } from "react";
import { OrderIdContext } from "@/lib/orderIdContext";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

interface CheckoutFormProps {
  dpmCheckerLink: string;
}

export default function CheckoutForm({ dpmCheckerLink }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const orderCtx = useContext(OrderIdContext);
  if (!orderCtx) {
    return <div>Error: OrderIdContext is not available.</div>;
  }

  const { orderId } = orderCtx;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);

    await fetch("/api/orderStatus", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: orderId, status: "Paid" }),
    });

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: process.env.STRIPE_RETURN_URL!,
      },
    });

    if (error) {
      await fetch("/api/orderStatus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status: "Pending" }),
      });
    }

    if (error?.type === "card_error" || error?.type === "validation_error") {
      setMessage(error.message ?? "Payment error");
    } else if (error) {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  return (
    <>
      <form id="payment-form" onSubmit={handleSubmit}>
        <PaymentElement id="payment-element" />
        <button
          className="text-white block m-auto border rounded p-2 my-4 bg-blue-700 hover:bg-blue-500 md:w-[600px] max-md:w-full mt-4"
          disabled={isLoading || !stripe || !elements}
          id="submit"
        >
          <span id="button-text">
            {isLoading ? (
              <div className="spinner" id="spinner"></div>
            ) : (
              "Pay now"
            )}
          </span>
        </button>

        {message && <div id="payment-message">{message}</div>}
      </form>

      <div id="dpm-annotation">
        <p className="text-center">
          Payment methods are dynamically displayed based on customer location,
          order amount, and currency.&nbsp;
          <a
            href={dpmCheckerLink}
            target="_blank"
            rel="noopener noreferrer"
            id="dpm-integration-checker"
          >
            Preview payment methods by transaction
          </a>
        </p>
      </div>
    </>
  );
}
