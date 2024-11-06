"use client";

import { FC, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Feedback } from "@/lib/types";
import Rating from "@mui/material/Rating";

const feedbackSchema = z.object({
  orderId: z.string(),
  productId: z.string(),
  rating: z.number().int().min(1, "Rating must be at least 1"),
  title: z.string().min(3, "Title must be at least 3 character"),
  comment: z.string().min(3, "Comment must be at least 3 character"),
});

interface EditFeedbackProps {
  feedback: Feedback | null;
  id: string;
}

const EditFeedback: FC<EditFeedbackProps> = ({ feedback, id }) => {
  const { rating, title, comment } = feedback || {};
  const queryClient = useQueryClient();
  const router = useRouter();
  const [input, setInput] = useState<{
    productId: string;
    orderId: string;
    rating: number | null;
    id: string;
    title: string;
    comment: string;
  }>({
    productId: feedback?.productId || "",
    orderId: feedback?.orderId || "",
    rating: rating || 1,
    id: id,
    title: title || "",
    comment: comment || "",
  });

  const mutation = useMutation({
    mutationFn: async (updatedData: typeof input) => {
      return await fetch("/api/crudFeedback", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      }).then((res) => res.json());
    },
    onSuccess: (data) => {
      if (data.status !== 200) {
        throw new Error(data.message);
      }
      queryClient.invalidateQueries({ queryKey: ["editFeedback"] });
      console.log("Feedback editet:", data);
      router.push("/dashboard/feedback");
    },
    onError: (error) => {
      console.error("Error editing feedback:", error);
    },
  });

  const [errors, setErrors] = useState<{
    title?: string;
    comment?: string;
    rating?: string;
  }>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRatingChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: number | null
  ) => {
    setInput((prev) => ({
      ...prev,
      rating: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Validate input using Zod schema
    try {
      feedbackSchema.parse(input);
      setErrors({});
      mutation.mutate(input);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0]] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="title">Title</label>
      <input
        id="title"
        name="title"
        type="text"
        value={input.title}
        onChange={handleInputChange}
      />
      {errors.title && <p>{errors.title}</p>}
      <Rating
        name="rating"
        value={input.rating}
        onChange={handleRatingChange}
      />
      {errors.rating && <p style={{ color: "red" }}>{errors.rating}</p>}
      <label htmlFor="comment">Comment</label>
      <textarea
        id="comment"
        name="comment"
        value={input.comment}
        onChange={handleInputChange}
      />
      {errors.comment && <p>{errors.comment}</p>}

      <button type="submit">Edit Product</button>
    </form>
  );
};

export default EditFeedback;
