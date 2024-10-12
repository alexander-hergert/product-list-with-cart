import Cart from "@/components/products/Cart";
import ProductsList from "@/components/products/ProductsList";
import dynamic from "next/dynamic";
const Modal = dynamic(() => import("@/components/products/Modal"), {
  ssr: false,
});

export default function ProductsPage() {
  return (
    <>
      <Modal />
      <div>
        <h1>Products</h1>
        <div className="flex justify-between gap-8 min-w-[800px]">
          <ProductsList />
          <Cart />
        </div>
      </div>
    </>
  );
}
