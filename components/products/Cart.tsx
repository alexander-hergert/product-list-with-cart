"use client";

import { useContext } from "react";
import { CartContext } from "@/lib/cartContext";

const Cart = () => {
  const cartContext = useContext(CartContext);

  if (!cartContext) {
    return <div>Error: CartContext is not available.</div>;
  }

  const { cart, removeProduct } = cartContext;

  const totalPrice = Object.keys(cart).reduce((acc, id) => {
    return acc + cart[id].price * cart[id].quantity;
  }, 0);

  return (
    <div className="min-w-[150px] mr-8">
      <h2>Cart</h2>
      {Object.keys(cart).map(
        (id) =>
          cart[id].quantity > 0 && (
            <div key={id} className="my-4 flex items-center gap-4">
              <div>
                <h3>{cart[id].name}</h3>
                <p>Price: @${cart[id].price}</p>
                <p>Price: ${cart[id].price * cart[id].quantity}</p>
                <p>Quantity: {cart[id].quantity}</p>
              </div>
              <button onClick={() => removeProduct(id)}>REMOVE</button>
            </div>
          )
      )}
      <div>Total Price: ${totalPrice}</div>
    </div>
  );
};

export default Cart;
