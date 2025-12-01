"use client";

import Image from "next/image";
import { Product } from "@/lib/types";
import { useContext, useEffect } from "react";
import { CartContext } from "@/lib/cartContext";
import Link from "next/link";
import dynamic from "next/dynamic";

const AddToCart = dynamic(() => import("@/components/products/AddToCart"), {
  ssr: false,
});

interface SingleProductProps {
  singleProduct: Product;
  mainCategory?: string;
}

const SingleProduct: React.FC<SingleProductProps> = ({
  singleProduct,
  mainCategory,
}) => {
  const cartContext = useContext(CartContext);

  const cart = cartContext?.cart ?? {};

  const { id, image, name, sub_category, price } = singleProduct;

  useEffect(() => {
    if (!cartContext) return;

    const localCart = localStorage.getItem("cart");
    if (!localCart) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cartContext, cart]);

  if (!cartContext) {
    return <div>Error: CartContext is not available.</div>;
  }

  return (
    <div className="max-md:mb-4 w-[250px] h-[347px] justify-self-start max-lg:w-[213px] max-md:w-[327px] max-md:h-[400px]">
      <Link href={`/products/${mainCategory?.toLocaleLowerCase()}/${id}`}>
        <div className="flex flex-col justify-between gap-8">
          <div className="w-[250px] max-lg:w-[213px] max-md:w-[327px] overflow-hidden shadow-lg">
            <Image
              className={`cursor-pointer rounded-lg w-full object-cover aspect-square ${
                cart[id]?.quantity ? "border-2 border-red-800" : ""
              }`}
              src={image}
              width={200}
              height={200}
              alt={name}
            />
          </div>

          <div className="w-full max-w-xs truncate">
            <h3 className="text-gray-500 truncate">{sub_category}</h3>
            <h2 className="font-bold truncate">{name}</h2>
            <p className="text-red-800 truncate">${price.toFixed(2)}</p>
          </div>
        </div>
      </Link>

      <AddToCart id={id} image={image} name={name} price={price} shift={true} />
    </div>
  );
};

export default SingleProduct;
