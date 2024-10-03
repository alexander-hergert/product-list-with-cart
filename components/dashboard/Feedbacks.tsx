import { Feedback } from "@/lib/types";
import Link from "next/link";

interface FeedbacksProps {
  feedbacks: Feedback[];
}

const Feedbacks: React.FC<FeedbacksProps> = ({ feedbacks }) => {
  return (
    <div className="border">
      <h2>Feedback</h2>
      <ul>
        {feedbacks.map((feedback) => (
          <li key={feedback.id}>{feedback.title}</li>
        ))}
      </ul>
      <Link
        className="text-blue-500 hover:text-blue-700"
        href="/dashboard/feedback"
      >
        ... see more
      </Link>
    </div>
  );
};

export default Feedbacks;
