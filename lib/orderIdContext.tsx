import { createContext, useState } from "react";
import { ReactNode } from "react";

interface OrderIdContextType {
  orderId: string;
  setOrderId: (orderId: string) => void;
}

export const OrderIdContext = createContext<OrderIdContextType | undefined>(
  undefined
);

export const OrderIdProvider = ({ children }: { children: ReactNode }) => {
  const [orderId, setOrderId] = useState<string>("");

  return (
    <OrderIdContext.Provider value={{ orderId, setOrderId }}>
      {children}
    </OrderIdContext.Provider>
  );
};
