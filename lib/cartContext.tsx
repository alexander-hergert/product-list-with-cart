"use client";

import { createContext, useState, useEffect } from "react";
import { ReactNode } from "react";
import { Cart } from "@/lib/types";

interface CartContextType {
  cart: Cart;
  setCart: React.Dispatch<React.SetStateAction<Cart>>;
  changeCart: (
    id: string,
    name: string,
    price: number,
    newQuantity: number
  ) => void;
  removeProduct: (id: string) => void;
}

export const CartContext = createContext<CartContextType | undefined>(
  undefined
);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Cart>({});

  useEffect(() => {
    const localCart = localStorage.getItem("cart");
    if (localCart) {
      setCart(JSON.parse(localCart));
    }
  }, []);

  const changeCart = (
    id: string,
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

  const removeProduct = (id: string) => {
    const updatedCart = { ...cart };
    delete updatedCart[id];
    setCart(updatedCart);
    //set local storage
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  return (
    <CartContext.Provider value={{ cart, setCart, changeCart, removeProduct }}>
      {children}
    </CartContext.Provider>
  );
};
