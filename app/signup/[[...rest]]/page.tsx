import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-2xl mb-4">Sign Up Form</h1>
      <SignUp />
    </main>
  );
}
