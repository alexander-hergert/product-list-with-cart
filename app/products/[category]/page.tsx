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

export default function ProductsPathPage({
  searchParams,
  params,
}: {
  searchParams: SearchParams;
  params: { category: string };
}) {
  return (
    <>
      <Modal />
      <div>
        <div className="m-auto max-lg:flex-col max-md:w-[327px]">
          <div>
            <h2 className="text-2xl text-center">Filter</h2>
            <Filter />
          </div>
          <div>
            <h2 className="text-2xl text-center">Sort</h2>
            <Sort />
          </div>
        </div>
        <div
          className="flex m-auto gap-8 w-[1216px] mt-4 max-lg:flex-col max-lg:w-[688px] max-lg:items-center
        max-md:w-[327px] max-md:block max-md:m-auto"
        >
          <ProductsList searchParams={searchParams} params={params} />
          <Cart />
        </div>
      </div>
    </>
  );
}
