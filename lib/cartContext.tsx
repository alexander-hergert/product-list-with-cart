import { createContext, useState } from "react";
import { ReactNode } from "react";
import { Cart } from "@/lib/types";

interface CartContextType {
  cart: Cart;
  changeCart: (id: string, name: string, price: number, newQuantity: number) => void;
  removeProduct: (id: string) => void;
}


export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const localCart = localStorage.getItem("cart");
  const [cart, setCart] = useState<Cart>(
    localCart ? JSON.parse(localCart) : {}
  );

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
  }

  return (
    <CartContext.Provider value={{ cart, changeCart, removeProduct }}>
      {children}
    </CartContext.Provider>
  );
};
