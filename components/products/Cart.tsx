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

  //SendOder function POST request to the server
  const sendOrder = async () => {
    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cart),
      });
      const res = await response.json();
      console.log(res.message || res.error);
    } catch (error) {
      //client error
      console.log(error);
    }
  };

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
      <button onClick={sendOrder}>Confirm Order</button>
    </div>
  );
};

export default Cart;
