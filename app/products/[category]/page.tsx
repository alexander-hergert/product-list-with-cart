import Cart from "@/components/products/Cart";
import ProductsList from "@/components/products/ProductsList";
import Filter from "@/components/Filter";
import Sort from "@/components/Sort";
import Modal from "@/components/products/Modal";
import { redirect } from "next/navigation";

type SearchParams = {
  productName?: string;
  productCategory?: string;
  minPrice?: string;
  maxPrice?: string;
  order?: string;
};

const pathnames = ["breakfast", "lunch", "dessert", "drinks", "menu"];

export default function ProductsPathPage({
  searchParams,
  params,
}: {
  searchParams: SearchParams;
  params: { category: string };
}) {
  const pathname = params.category.toLowerCase();
  if (!pathnames.includes(pathname)) redirect("/products");

  return (
    <>
      <Modal />
      <main>
        <div className="mt-4 gap-4 flex flex-wrap justify-center m-auto max-lg:flex-col max-md:w-[327px]">
          <div>
            <Filter isAdmin={false} />
          </div>
          <div>
            <Sort isAdmin={false} />
          </div>
        </div>
        <div
          className="flex m-auto gap-8 w-[1216px] mt-4 max-lg:flex-col max-lg:w-[688px] max-lg:items-center
        max-md:w-[327px] max-md:block max-md:m-auto"
        >
          <ProductsList searchParams={searchParams} params={params} />
          <Cart />
        </div>
      </main>
    </>
  );
}
