"use client";

import { FC } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

interface DeleteProductProps {
  id: string;
}

const DeleteProduct: FC<DeleteProductProps> = ({ id }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (updatedData: typeof id) => {
      return await fetch("/api/crudProduct", {
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
      queryClient.invalidateQueries({ queryKey: ["deleteProduct"] });
      console.log("Product deleted:", data);
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
    <form onSubmit={handleSubmit} className="self-center w-full text-center">
      <button className="border rounded p-2 my-2 hover:bg-red-600 hover:text-white w-[95%]">
        Delete
      </button>
    </form>
  );
};

export default DeleteProduct;
