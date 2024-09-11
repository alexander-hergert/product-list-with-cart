import Link from "next/link";
import Cart from "@/components/products/Cart";
import ProductsList from "@/components/products/ProductsList";
import Product from "@/lib/types";

export default function ProductsPage() {
  return (
    <div>
      <h1>Products</h1>
      <div className="flex justify-between gap-8 w-[150px]">
        <ProductsList />
        <Cart />
      </div>
      <br />
      <Link href="/">To Home</Link>
    </div>
  );
}
