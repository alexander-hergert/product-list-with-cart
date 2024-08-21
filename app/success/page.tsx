import Link from "next/link";

import dynamic from "next/dynamic";
const SignUpHandler = dynamic(() => import("@/components/SignUpHandler"), {
  ssr: false,
});

export default function SuccesPage() {
  return (
    <div>
      <SignUpHandler />
      <h1>Success</h1>
      <p>You have succesfully created an account!</p>
      <Link href="/">Back Home</Link>
    </div>
  );
}
