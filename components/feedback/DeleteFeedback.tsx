"use client";

import { FC } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

interface DeleteFeedbackProps {
  id: string;
}

const DeleteFeedback: FC<DeleteFeedbackProps> = ({ id }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (updatedData: typeof id) => {
      return await fetch("/api/crudFeedback", {
        method: "DELETE",
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
      queryClient.invalidateQueries({ queryKey: ["deleteFeedback"] });
      console.log("Feedback deleted:", data);
      router.refresh();
    },
    onError: (error) => {
      console.error("Error deleting Product:", error);
    },
  });
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      mutation.mutate(id);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <button>Delete</button>
    </form>
  );
};

export default DeleteFeedback;
