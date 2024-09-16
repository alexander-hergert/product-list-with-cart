import { createContext, useState } from "react";
import { ReactNode } from "react";
import { Cart } from "@/lib/types";

export const CartContext = createContext();

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const localCart = localStorage.getItem("cart");
  const [cart, setCart] = useState<Cart>(
    localCart ? JSON.parse(localCart) : {}
  );

  const changeCart = (
    id: number,
    name: string,
    price: number,
    newQuantity: number
  ) => {
    const updatedCart = {
      ...cart,
      [id]: {
        name,
        price,
        quantity: newQuantity,
      },
    };
    setCart(updatedCart);
    //set local storage
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeProduct = (id: number) => {
    const updatedCart = { ...cart };
    delete updatedCart[id];
    setCart(updatedCart);
    //set local storage
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  }

  return (
    <CartContext.Provider value={{ cart, changeCart, removeProduct }}>
      {children}
    </CartContext.Provider>
  );
};
