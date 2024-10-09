"use client";

import { FC, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ProfileFormProps {
  id: string | undefined;
  status: string | undefined;
}

const OrderStatusChange: FC<ProfileFormProps> = ({ id, status }) => {
  const queryClient = useQueryClient();
  const [input, setInput] = useState({
    id,
    status,
  });

  const mutation = useMutation({
    mutationFn: async (updatedData: typeof input) => {
      return await fetch("/api/orderStatus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      }).then((res) => res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["orderStatus"] });
      console.log("Order status updated:", data);
    },
    onError: (error) => {
      console.error("Error updating profile:", error);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate(input);
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setInput({
      ...input,
      status: e.target.value,
    });
  };

  return (
    <div>
      <h1>Order Status Change</h1>
      <form onSubmit={(e) => handleSubmit(e)}>
        <div>
          <label>Status:</label>
          <select
            onChange={(e) => handleChange(e)}
            defaultValue={input?.status}
          >
            <option value="Pending">Pending</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        <button className="border" type="submit">Change Status</button>
      </form>
    </div>
  );
};

export default OrderStatusChange;
