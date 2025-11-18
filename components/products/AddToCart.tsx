"use client";

import { useContext } from "react";
import { CartContext } from "@/lib/cartContext";
import Image from "next/image";

interface AddToCartProps {
  id: string;
  image: string;
  name: string;
  price: number;
  shift?: boolean;
}

const AddToCart: React.FC<AddToCartProps> = ({
  id,
  image,
  name,
  price,
  shift,
}) => {
  const cartContext = useContext(CartContext);

  if (!cartContext) {
    return <div>Error: CartContext is not available.</div>;
  }

  const { cart, changeCart } = cartContext;

  const handleUpClick = () => {
    const newQuantity = cart[id] ? cart[id].quantity + 1 : 1;
    changeCart(id, image, name, price, newQuantity);
  };

  const handleDownClick = () => {
    const newQuantity = cart[id] ? cart[id].quantity - 1 : 0;
    if (newQuantity < 0) return;
    changeCart(id, image, name, price, newQuantity);
  };

  return (
    <>
      {!cart[id]?.quantity && (
        <div
          className={
            "flex justify-center text-black" +
            (shift ? " relative bottom-[8rem] z-10" : "")
          }
        >
          <button
            data-testid="add-to-cart-button"
            onClick={handleUpClick}
            className="flex justify-between items-center border border-red-800 rounded-[20px] px-6 p-4 w-[160px] h-[44px] bg-white dark:bg-slate-200"
          >
            <Image
              src="/images/icon-add-to-cart.svg"
              alt="cart-icon"
              width={20}
              height={20}
            />
            Add to Cart
          </button>
        </div>
      )}
      {cart[id]?.quantity ? (
        <div
          className={
            "flex justify-center" +
            (shift ? " relative bottom-[8rem] z-10" : "")
          }
        >
          <div className="flex justify-between items-center rounded-[20px] bg-orange-700 text-white px-6 p-4 w-[160px] h-[44px]">
            <button data-testid="decrement-button" onClick={handleDownClick}>
              <div className="grid place-items-center border rounded-[50%] h-4 w-4">
                <Image
                  src="/images/icon-decrement-quantity.svg"
                  alt="decrement-icon"
                  width={10}
                  height={10}
                />
              </div>
            </button>
            <div>{cart[id] ? cart[id].quantity : 0}</div>
            <div className="grid place-items-center border border-white rounded-[50%] h-4 w-4">
              <button data-testid="increment-button" onClick={handleUpClick}>
                <Image
                  src="/images/icon-increment-quantity.svg"
                  alt="increment-icon"
                  width={10}
                  height={10}
                />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default AddToCart;
