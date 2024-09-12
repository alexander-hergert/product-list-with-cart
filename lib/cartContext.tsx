import { createContext, useState } from "react";
import { ReactNode } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    //setCart([...cart, product]);
    console.log("Product +++");
    
  };

  const removeFromCart = (productId) => {
    //setCart(cart.filter((product) => product.id !== productId));
    console.log("Product ---");
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
