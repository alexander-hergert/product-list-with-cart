import Link from "next/link";
export default function FeedbackPage() {
  return (
    <div>
      <h1>Feedback</h1>
      <br />
      <Link className="text-blue-500 hover:text-blue-700" href="/dashboard">
        To Dashboard
      </Link>
    </div>
  );
}
