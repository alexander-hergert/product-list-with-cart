import Cart from "@/components/products/Cart";
import ProductsList from "@/components/products/ProductsList";
import Filter from "@/components/dashboard/Filter";
import Sort from "@/components/dashboard/Sort";
import dynamic from "next/dynamic";
const Modal = dynamic(() => import("@/components/products/Modal"), {
  ssr: false,
});

type SearchParams = {
  productName?: string;
  productCategory?: string;
  minPrice?: string;
  maxPrice?: string;
  order?: string;
};

export default function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <>
      <Modal />
      <div>
        <h1>Products</h1>
        <h2>Filter</h2>
        <Filter />
        <h2>Sort</h2>
        <Sort />
        <div className="flex justify-center gap-8 min-w-[800px]">
          <ProductsList searchParams={searchParams} />
          <Cart />
        </div>
      </div>
    </>
  );
}
