import { FC } from "react";

interface FeedbackProps {
  feedbacks: {
    id: string;
    title: string;
    comment: string;
    rating: number;
    productId: string;
    orderId: string;
  }[];
  users:
    | {
        id: string;
        name: string;
        email: string;
        address: string;
        image: string;
        createdAt: Date;
      }[];
}

const Feedbacks: FC<FeedbackProps> = ({ feedbacks, users }) => {
  return (
    <section>
      <h3 className="font-bold text-xl text-center mt-4">
        Feedback for product
      </h3>
      <div className="carousel w-full mt-4">
        {feedbacks?.map((singleFeedback, i) => {
          const total = feedbacks?.length || 0;
          const prevSlide = i > 0 ? "#slide" + i : "#slide" + total;
          const nextSlide = total > i + 1 ? "#slide" + (i + 2) : "#slide1";
          return (
            <div
              id={"slide" + (i + 1)}
              key={singleFeedback.id}
              className="carousel-item relative w-full"
            >
              <div className="w-full h-full flex flex-col items-center justify-center p-5 border">
                <h4 className="font-bold">{`Feedback (${
                  i + 1
                } / ${total})`}</h4>
                <p>{singleFeedback.title}</p>
                <p>{singleFeedback.comment}</p>
                <p>By: {users?.[i]?.name}</p>
              </div>
              <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                <a href={prevSlide} className="btn btn-circle">
                  ❮
                </a>
                <a href={nextSlide} className="btn btn-circle">
                  ❯
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Feedbacks;
