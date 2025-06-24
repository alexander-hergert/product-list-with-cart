"use client";

import { FC, useState, useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { OrderIdContext } from "@/lib/orderIdContext";

interface ProfileFormProps {
  id: string | undefined;
  status: string | undefined;
}

const OrderFinish: FC<ProfileFormProps> = ({ id, status }) => {
  const queryClient = useQueryClient();
  const [input, setInput] = useState({
    orderId: id,
    status,
  });
  const router = useRouter();
  const orderIdContext = useContext(OrderIdContext);
  if (!orderIdContext) {
    throw new Error(
      "OrderIdContext is undefined. Make sure you are using OrderFinish inside OrderIdProvider."
    );
  }
  const { setOrderId } = orderIdContext;

  const mutation = useMutation({
    mutationFn: async (updatedData: typeof input) => {
      //   return await fetch("/api/create-payment-intent", {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify(updatedData),
      //   }).then((res) => res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["orderFinish"] });
      console.log("Order status updated:", data);
      const res = fetch("/api/orderStatus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          status: "Paid",
        }),
      });
    },
    onError: (error) => {
      console.error("Error updating order:", error);
      const res = fetch("/api/orderStatus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          status: "Pending",
        }),
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (id) {
      setOrderId(id);
    }
    router.push("/payment");
    mutation.mutate(input);
  };

  return (
    <div className="my-4">
      <h2 className="text-xl">Finish Payment...</h2>
      <form onSubmit={(e) => handleSubmit(e)}>
        <button
          className="border rounded p-2 my-2 hover:bg-black hover:text-white"
          type="submit"
        >
          To Checkout
        </button>
      </form>
    </div>
  );
};

export default OrderFinish;
