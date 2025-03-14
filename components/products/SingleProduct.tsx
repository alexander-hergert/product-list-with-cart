"use client";

import Image from "next/image";
import { Product } from "@/lib/types";
import { useContext, useEffect } from "react";
import { CartContext } from "@/lib/cartContext";
import Link from "next/link";

interface SingleProductProps {
  singleProduct: Product;
}

const SingleProduct: React.FC<SingleProductProps> = ({ singleProduct }) => {
  const cartContext = useContext(CartContext);

  if (!cartContext) {
    return <div>Error: CartContext is not available.</div>;
  }

  const { cart, changeCart } = cartContext;

  const { id, image, name, sub_category, price } = singleProduct;

  const handleUpClick = () => {
    const newQuantity = cart[id] ? cart[id].quantity + 1 : 1;
    changeCart(id, image, name, price, newQuantity);
  };

  const handleDownClick = () => {
    const newQuantity = cart[id] ? cart[id].quantity - 1 : 0;
    if (newQuantity < 0) return;
    changeCart(id, image, name, price, newQuantity);
  };

  useEffect(() => {
    //check if localstorage has the cart
    const localCart = localStorage.getItem("cart");
    if (!localCart) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, []);

  return (
    <div className="max-md:mb-4 w-[250px] h-[347px] justify-self-start max-lg:w-[213px] max-md:w-[327px] max-md:h-[400px]">
      <Link href={`/products/${id}`}>
        <div className="flex flex-col justify-between gap-8">
          <div className="w-[250px] max-lg:w-[213px] max-md:w-[327px] overflow-hidden">
            <Image
              className={`cursor-pointer rounded-lg w-full object-cover aspect-square ${
                cart[id]?.quantity ? "border-2 border-red-800" : ""
              }`}
              src={singleProduct.image}
              width={200}
              height={200}
              alt={singleProduct.name}
            />
          </div>
          <div className="w-full max-w-xs truncate">
            <h2 className="text-gray-500 truncate">{sub_category}</h2>
            <h2 className="font-bold truncate">{name}</h2>
            <p className="text-red-800 truncate">${price.toFixed(2)}</p>
          </div>
        </div>
      </Link>
      {!cart[id]?.quantity && (
        <div className="flex justify-center relative bottom-[8rem] z-10">
          <button
            onClick={handleUpClick}
            className="flex justify-between items-center border border-red-800 rounded-[20px] px-6 p-4 w-[160px] h-[44px] bg-white"
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
        <div className="flex justify-center relative bottom-[8rem] z-10">
          <div className="flex justify-between items-center rounded-[20px] bg-orange-700 text-white px-6 p-4 w-[160px] h-[44px]">
            <button onClick={handleDownClick}>
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
              <button onClick={handleUpClick}>
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
    </div>
  );
};

export default SingleProduct;
