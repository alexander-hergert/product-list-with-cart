import dynamic from "next/dynamic";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const StripeForm = dynamic(() => import("@/components/stripe/StripeForm"), {
  ssr: false,
});

export default function PaymentPage() {
  const { userId } = auth();
  if (!userId) redirect("/");
  return (
    <main>
      <h1 className="text-center my-4 text-2xl font-bold">Payment Process</h1>
      <StripeForm />
    </main>
  );
}
