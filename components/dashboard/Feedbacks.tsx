import { Feedback } from "@/lib/types";

interface FeedbacksProps {
  feedbacks: Feedback[];
}

const Feedbacks: React.FC<FeedbacksProps> = ({ feedbacks }) => {
  return (
    <div>
      <h2>Feedbacks</h2>
      <ul>
        {feedbacks.map((feedback) => (
          <li key={feedback.id}>{feedback.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default Feedbacks;
