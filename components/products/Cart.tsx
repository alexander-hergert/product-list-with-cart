"use client";

import { useContext } from "react";
import { CartContext } from "@/lib/cartContext";

const Cart = () => {
  const { cart, changeCart, removeProduct } = useContext(CartContext);

  return (
    <div className="min-w-[150px]">
      <h2>Cart</h2>
      {Object.keys(cart).map(
        (id) =>
          cart[id].quantity > 0 && (
            <div key={id} className="my-4 flex items-center gap-4">
              <div>
                <h3>{cart[id].name}</h3>
                <p>Price: ${cart[id].price}</p>
                <p>Quantity: {cart[id].quantity}</p>
              </div>
              <button onClick={() => removeProduct(id)}>REMOVE</button>
            </div>
          )
      )}
    </div>
  );
};

export default Cart;
