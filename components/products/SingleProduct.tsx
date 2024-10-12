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

  const { id, name, description, price } = singleProduct;

  const handleUpClick = () => {
    const newQuantity = cart[id] ? cart[id].quantity + 1 : 1;
    changeCart(id, name, price, newQuantity);
  };

  const handleDownClick = () => {
    const newQuantity = cart[id] ? cart[id].quantity - 1 : 0;
    if (newQuantity < 0) return;
    changeCart(id, name, price, newQuantity);
  };

  useEffect(() => {
    //check if localstorage has the cart
    const localCart = localStorage.getItem("cart");
    if (!localCart) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, []);

  return (
    <div>
      <Link href={`/products/${id}`}>
        <Image
          src={singleProduct.image}
          width={200}
          height={200}
          alt={singleProduct.name}
        />
        <h2>{name}</h2>
        <p>{description}</p>
        <p>Price: ${price}</p>
      </Link>
      <div>
        <div>
          <button onClick={handleUpClick}>Add to Cart</button>
        </div>
        <div>
          <button onClick={handleDownClick}>Remove from Cart</button>
        </div>
      </div>
      <div>Quantity: {cart[id] ? cart[id].quantity : 0}</div>
    </div>
  );
};

export default SingleProduct;
