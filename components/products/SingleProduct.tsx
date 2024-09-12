"use client";

import Image from "next/image";
import { Product } from "@/lib/types";
import { useContext } from "react";
import { CartContext } from "@/lib/cartContext";

interface SingleProductProps {
  singleProduct: Product;
}

const SingleProduct: React.FC<SingleProductProps> = ({ singleProduct }) => {
  const { addToCart, removeFromCart } = useContext(CartContext);
  return (
    <div>
      <Image
        src={singleProduct.image}
        width={200}
        height={200}
        alt={singleProduct.name}
      />
      <h2>{singleProduct.name}</h2>
      <p>{singleProduct.description}</p>
      <p>Price: ${singleProduct.price}</p>
      <div>
        <button onClick={addToCart}>Add to Cart</button>
        <button onClick={removeFromCart}>Remove from Cart</button>
      </div>
    </div>
  );
};

export default SingleProduct;
