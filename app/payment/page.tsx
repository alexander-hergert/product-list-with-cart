import dynamic from "next/dynamic";

const StripeForm = dynamic(() => import("@/components/stripe/StripeForm"), {
  ssr: false,
});

export default function PaymentPage() {
  return (
    <>
      <h1 className="text-center my-4 text-2xl font-bold">
        Payment
      </h1>
      <StripeForm />
    </>
  );
}
