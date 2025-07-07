"use client";
import { useRouter, usePathname } from "next/navigation";

const Filter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const page = pathname.split("/")[2];
  const pageProducts = pathname.split("/")[1];
  let query = "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    // Access form values for /dashboard/products page
    if (page === "products") {
      const productname = (
        target.elements.namedItem("productname") as HTMLInputElement
      ).value;
      const minPrice = (
        target.elements.namedItem("minPrice") as HTMLInputElement
      ).value;
      const maxPrice = (
        target.elements.namedItem("maxPrice") as HTMLInputElement
      ).value;
      query = `?productname=${productname}&minPrice=${minPrice}&maxPrice=${maxPrice}`;
    } else if (page === "customers") {
      // Access form values for /dashboard/customers page
      const username = (
        target.elements.namedItem("username") as HTMLInputElement
      ).value;
      const email = (target.elements.namedItem("email") as HTMLInputElement)
        .value;
      const address = (target.elements.namedItem("address") as HTMLInputElement)
        .value;
      query = `?username=${username}&email=${email}&address=${address}`;
    } else if (page === "orders") {
      // Access form values for /dashboard/orders page
      const status = (target.elements.namedItem("status") as HTMLSelectElement)
        .value;
      const minDate = (target.elements.namedItem("minDate") as HTMLInputElement)
        .value;
      const maxDate = (target.elements.namedItem("maxDate") as HTMLInputElement)
        .value;
      const minTotalPrice = (
        target.elements.namedItem("minTotalPrice") as HTMLInputElement
      ).value;
      const maxTotalPrice = (
        target.elements.namedItem("maxTotalPrice") as HTMLInputElement
      ).value;
      query = `?status=${status}&minDate=${minDate}&maxDate=${maxDate}&minTotalPrice=${minTotalPrice}&maxTotalPrice=${maxTotalPrice}`;
    } else if (page === "feedback") {
      // Access form values for /dashboard/feedback page
      const minDate = (target.elements.namedItem("minDate") as HTMLInputElement)
        .value;
      const maxDate = (target.elements.namedItem("maxDate") as HTMLInputElement)
        .value;
      query = `?minDate=${minDate}&maxDate=${maxDate}`;
    } else if (pageProducts === "products") {
      // Access form values for /products page
      const productName = (
        target.elements.namedItem("productName") as HTMLInputElement
      ).value;
      const productCategory = (
        target.elements.namedItem("productCategory") as HTMLInputElement
      ).value;
      const minPrice = (
        target.elements.namedItem("minPrice") as HTMLInputElement
      ).value;
      const maxPrice = (
        target.elements.namedItem("maxPrice") as HTMLInputElement
      ).value;
      query = `?productName=${productName}&productCategory=${productCategory}&minPrice=${minPrice}&maxPrice=${maxPrice}`;
    }
    router.push(query);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`rounded-xl m-auto p-3 bg-amber-900 dark:bg-amber-950 text-white flex gap-4 h-[80px]
        max-lg:flex-col max-lg:h-[300px] max-lg:w-[688px] max-md:h-[450px] max-md:w-[327px]
        [&_input]:text-black [&_input]:rounded [&_select]:text-black [&_select]:rounded
        ${
          page === "feedback"
            ? "w-[500px] max-md:h-[250px] max-lg:h-[150px]"
            : "w-[900px]"
        }
        ${
          page === "customers" || page === "products"
            ? "w-[500px] max-md:h-[300px] max-lg:h-[300px]"
            : "w-[900px]"
        }
        ${
          pageProducts === "products"
            ? "w-[500px] max-md:h-[375px] max-lg:h-[250px]"
            : "w-[900px]"
        }
        `}
    >
      {/* Show form fields for /dashboard/products page */}
      {page === "products" && (
        <>
          <div className="flex flex-col gap-2">
            <label htmlFor="productname">Product Name</label>
            <input id="productname" type="text" name="productname" />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="minPrice">Min. Price</label>
            <input id="minPrice" type="number" name="minPrice" />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="maxPrice">Max. Price</label>
            <input id="maxPrice" type="number" name="maxPrice" />
          </div>
        </>
      )}
      {/** Show form fields for /dashboard/customers */}
      {page === "customers" && (
        <>
          <div className="flex flex-col gap-2">
            <label htmlFor="username">Username:</label>
            <input id="username" type="text" name="username" />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="email">Email:</label>
            <input id="email" type="email" name="email" />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="address">Address:</label>
            <input id="address" type="text" name="address" />
          </div>
        </>
      )}
      {/** Show form fields for /dashboard/orders */}
      {page === "orders" && (
        <div
          className="flex justify-center gap-4 max-lg:grid max-lg:grid-cols-2 max-lg:grid-rows-2
        max-md:grid-rows-4 max-md:grid-cols-1"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="status">Status:</label>
            <select id="status" name="status">
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="minDate">Min. Date:</label>
            <input id="minDate" type="date" name="minDate" />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="maxDate">Max. Date:</label>
            <input id="maxDate" type="date" name="maxDate" />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="minTotalPrice">Min. Total Price:</label>
            <input id="minTotalPrice" type="number" name="minTotalPrice" />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="maxTotalPrice">Max. Total Price:</label>
            <input id="maxTotalPrice" type="number" name="maxTotalPrice" />
          </div>
        </div>
      )}
      {/** Show form fields for /dashboard/feedback */}
      {page === "feedback" && (
        <div
          className="flex justify-center gap-4 max-lg:grid max-lg:grid-cols-2 max-lg:grid-rows-1
        max-md:grid-rows-2 max-md:grid-cols-1"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="minDate">Min. Date:</label>
            <input id="minDate" type="date" name="minDate" />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="maxDate">Max. Date:</label>
            <input id="maxDate" type="date" name="maxDate" />
          </div>
        </div>
      )}
      {/** Show form fields for /products */}
      {pageProducts === "products" && (
        <div
          className="flex justify-center gap-4 max-lg:grid max-lg:grid-cols-2 max-lg:grid-rows-2
        max-md:grid-rows-4 max-md:grid-cols-1"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="productName">Product Name</label>
            <input id="productName" type="text" name="productName" />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="productCategory">Product Category</label>
            <input id="productCategory" type="text" name="productCategory" />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="minPrice">Min. Price</label>
            <input id="minPrice" type="number" name="minPrice" />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="maxPrice">Max. Price</label>
            <input id="maxPrice" type="number" name="maxPrice" />
          </div>
        </div>
      )}
      <button
        className="p-4 bg-orange-700 dark:bg-orange-800 text-white rounded-[25px] w-[100px] h-[53px] m-auto"
        type="submit"
      >
        Filter
      </button>
    </form>
  );
};

export default Filter;
