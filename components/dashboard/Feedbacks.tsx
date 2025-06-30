import { Feedback } from "@/lib/types";
import Link from "next/link";

interface FeedbacksProps {
  feedbacks: Feedback[];
}

const Feedbacks: React.FC<FeedbacksProps> = ({ feedbacks }) => {
  return (
    <Link
      href="/dashboard/customers"
      className="border rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow duration-300 h-80"
    >
      <h2 className="text-xl mb-4">Feedback</h2>
      <ul>
        {feedbacks.map((feedback) => (
          <li key={feedback.id} className="mb-2">
            {feedback.title}
          </li>
        ))}
      </ul>
    </Link>
  );
};

export default Feedbacks;
