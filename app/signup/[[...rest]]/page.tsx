import dynamic from "next/dynamic";
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center">
      <h1>Sign Up Form</h1>
      <SignUp forceRedirectUrl="/success" />
    </main>
  );
}
