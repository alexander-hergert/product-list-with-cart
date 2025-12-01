import { createContext, useState, ReactNode } from "react";

export interface OrderIdContextType {
  orderId: string | null;
  setOrderId: (orderId: string | null) => void;
}

export const OrderIdContext = createContext<OrderIdContextType | undefined>(
  undefined
);

export const OrderIdProvider = ({ children }: { children: ReactNode }) => {
  const [orderId, setOrderId] = useState<string | null>(null);

  return (
    <OrderIdContext.Provider value={{ orderId, setOrderId }}>
      {children}
    </OrderIdContext.Provider>
  );
};
