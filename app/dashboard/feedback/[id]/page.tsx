import Link from "next/link";
export default function FeedbackDetailsPage() {
  return (
    <div>
      <h1>Feedback Details</h1>
      <br />
      <Link
        className="text-blue-500 hover:text-blue-700"
        href="/dashboard/feedback"
      >
        ... Back to Feedback
      </Link>
    </div>
  );
}
