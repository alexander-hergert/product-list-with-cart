"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface SortProps {
  isAdmin: boolean;
}

const Sort = ({ isAdmin }: SortProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const page = pathname.split("/")[2];
  const pageProducts = pathname.split("/")[1];
  let query = "";

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    const target = e.target;
    if (page === "products") {
      const productname = searchParams.get("productname") || "";
      const price = searchParams.get("price") || "";
      const order = target.value;
      query = `?productname=${productname}&price=${price}&order=${order}`;
    } else if (page === "customers") {
      const username = searchParams.get("username") || "";
      const email = searchParams.get("email") || "";
      const address = searchParams.get("address") || "";
      const order = target.value;
      query = `?username=${username}&email=${email}&address=${address}&order=${order}`;
    } else if (page === "orders") {
      const status = searchParams.get("status") || "";
      const minDate = searchParams.get("minDate") || "";
      const maxDate = searchParams.get("maxDate") || "";
      const minTotalPrice = searchParams.get("minTotalPrice") || "";
      const maxTotalPrice = searchParams.get("maxTotalPrice") || "";
      const order = target.value;
      query = `?status=${status}&minDate=${minDate}&maxDate=${maxDate}&minTotalPrice=${minTotalPrice}&maxTotalPrice=${maxTotalPrice}&order=${order}`;
    } else if (page === "feedback") {
      const username = searchParams.get("username") || "";
      const minDate = searchParams.get("minDate") || "";
      const maxDate = searchParams.get("maxDate") || "";
      const order = target.value;
      if (isAdmin) {
        query = `?username=${username}&minDate=${minDate}&maxDate=${maxDate}&order=${order}`;
      } else {
        query = `?minDate=${minDate}&maxDate=${maxDate}&order=${order}`;
      }
    } else if (pageProducts === "products") {
      const productname = searchParams.get("productname") || "";
      const productCategory = searchParams.get("productCategory") || "";
      const minPrice = searchParams.get("minPrice") || "";
      const maxPrice = searchParams.get("maxPrice") || "";
      const order = target.value;
      query = `?productname=${productname}&productCategory=${productCategory}&minPrice=${minPrice}&maxPrice=${maxPrice}&order=${order}`;
    }
    router.push(query);
  };
  return (
    <form
      action=""
      className="rounded-xl w-[300px] m-auto p-4 bg-gradient-to-r from-red-700 dark:from-red-800 to-red-950 dark:bg-amber-950 h-[80px] grid place-content-center max-md:w-[327px] [&_select]:rounded"
    >
      <select
        className="text-black"
        id="order"
        name="order"
        onChange={handleChange}
      >
        {page === "products" && (
          <>
            <option value="productnameAsc">Productname ascending</option>
            <option value="productnameDesc">Productname descending</option>
            <option value="priceAsc">Price ascending</option>
            <option value="priceDesc">Price descending</option>
          </>
        )}
        {page === "customers" && (
          <>
            <option value="usernameAsc">Username ascending</option>
            <option value="usernameDesc">Username descending</option>
            <option value="emailAsc">Email ascending</option>
            <option value="emailDesc">Email descending</option>
            <option value="addressAsc">Address ascending</option>
            <option value="addressDesc">Address descending</option>
          </>
        )}
        {page === "orders" && (
          <>
            <option value="dateAsc">Date ascending</option>
            <option value="dateDesc">Date descending</option>
            <option value="totalPriceAsc">Total price ascending</option>
            <option value="totalPriceDesc">Total price descending</option>
          </>
        )}
        {page === "feedback" && (
          <>
            {isAdmin && (
              <>
                <option value="usernameAsc">Username ascending</option>
                <option value="usernameDesc">Username descending</option>
              </>
            )}
            <option value="dateAsc">Date ascending</option>
            <option value="dateDesc">Date descending</option>
          </>
        )}
        {pageProducts === "products" && (
          <>
            <option value="productnameAsc">Productname ascending</option>
            <option value="productnameDesc">Productname descending</option>
            <option value="productCategoryAsc">
              Product category ascending
            </option>
            <option value="productCategoryDesc">
              Product category descending
            </option>
            <option value="priceAsc">Price ascending</option>
            <option value="priceDesc">Price descending</option>
          </>
        )}
      </select>
    </form>
  );
};

export default Sort;
