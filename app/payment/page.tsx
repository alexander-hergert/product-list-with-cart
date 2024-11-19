import dynamic from "next/dynamic";

const StripeForm = dynamic(() => import("@/components/stripe/StripeForm"), {
  ssr: false,
});

export default function PaymentPage() {
  return (
    <>
      <h1>Payment</h1>
      <StripeForm />
    </>
  );
}
