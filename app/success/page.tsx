import Link from "next/link";

export default function SuccesPage() {
  return (
    <div>
      <h1>Success</h1>
      <p>You have succesfully created an account!</p>
      <Link href="/">Back Home</Link>
    </div>
  );
}
