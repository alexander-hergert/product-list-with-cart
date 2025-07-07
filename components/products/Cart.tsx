"use client";

import { useContext } from "react";
import { CartContext } from "@/lib/cartContext";
import { ModalContext } from "@/lib/modalContext";
import { OrderIdContext } from "@/lib/orderIdContext";
import Image from "next/image";

const Cart = () => {
  const cartContext = useContext(CartContext);
  const modalContext = useContext(ModalContext);
  const orderIdContext = useContext(OrderIdContext);

  if (!cartContext) {
    return <div>Error: CartContext is not available.</div>;
  }

  if (!modalContext) {
    return <div>Error: ModalContext is not available.</div>;
  }

  if (!orderIdContext) {
    return <div>Error: OrderIdContext is not available.</div>;
  }

  const { cart, removeProduct } = cartContext;
  const { setIsModal } = modalContext;
  const { setOrderId } = orderIdContext;

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
      setOrderId(res?.order?.id);
      setIsModal(true);
    } catch (error) {
      //client error
      console.log(error);
    }
  };

  const items = Object.keys(cart).reduce((acc, id) => {
    return acc + cart[id].quantity;
  }, 0);

  const itemTypes = Object.keys(cart).reduce((acc, id) => {
    return acc + (cart[id].quantity > 0 ? 1 : 0);
  }, 0);

  return (
    <div
      className="min-w-[150px] border rounded-xl w-[384px] p-4 min-h-[300px] max-lg:w-[688px] justify-self-center max-md:w-[327px]"
      style={{ height: `${itemTypes * 80 + 300}px` }}
    >
      <h2 className="text-orange-800 text-2xl font-bold">
        Your Cart ({items})
      </h2>
      {itemTypes === 0 && (
        <div className="grid place-items-center">
          <Image
            src="/images/illustration-empty-cart.svg"
            alt="empty-cart-icon"
            width={200}
            height={200}
          />
          <p className="text-amber-900 dark:text-white">
            You added items will appear here
          </p>
        </div>
      )}
      {Object.keys(cart).map(
        (id) =>
          cart[id].quantity > 0 && (
            <div
              key={id}
              className="my-4 flex justify-between items-center gap-4 border-b pb-4"
            >
              <div>
                <h3 className="font-bold">{cart[id].name}</h3>
                <div className="flex gap-2">
                  <p className="text-red-800">{cart[id].quantity}x</p>
                  <p className="text-gray-500">@${cart[id].price}</p>
                  <p>${cart[id].price * cart[id].quantity}</p>
                </div>
              </div>
              <div className="grid place-items-center p-1 border-2 rounded-[50%]">
                <button onClick={() => removeProduct(id)}>
                  <Image
                    src="/images/icon-remove-item.svg"
                    alt="remove-icon"
                    width={10}
                    height={10}
                  />
                </button>
              </div>
            </div>
          )
      )}
      {itemTypes > 0 && (
        <>
          <div className="flex justify-between item-center mb-4">
            <p>Order Total</p>
            <p className="text-2xl font-bold">${totalPrice.toFixed(2)}</p>
          </div>
          <div className="flex items-center justify-center bg-slate-100 gap-4 text-xs rounded-xl p-4 mb-4 h-[52px]">
            <Image
              src="/images/icon-carbon-neutral.svg"
              alt="carbon-neutral-icon"
              width={20}
              height={20}
            />
            <p className="text-black">
              This is a <span className="font-bold ">carbon-neutral</span>{" "}
              delivery
            </p>
          </div>
          <button
            className="p-4 bg-orange-700 text-white rounded-[25px] w-full h-[53px]"
            onClick={sendOrder}
          >
            Confirm Order
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;
