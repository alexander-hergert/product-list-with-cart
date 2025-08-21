"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface FilterProps {
  isAdmin: boolean;
}

const Filter = ({ isAdmin }: FilterProps) => {
  const today = new Date().toISOString().split("T")[0];
  const router = useRouter();
  const pathname = usePathname();
  const page = pathname.split("/")[2];
  const pageProducts = pathname.split("/")[1];
  let query = "";
  const username = useSearchParams().get("username") || "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    // Access form values for /dashboard/products page
    if (page === "customers") {
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
      const id = (target.elements.namedItem("id") as HTMLInputElement).value;
      const username = (
        target.elements.namedItem("username") as HTMLInputElement
      ).value;
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
      if (isAdmin) {
        query = `?username=${username}&id=${id}&status=${status}&minDate=${minDate}&maxDate=${maxDate}&minTotalPrice=${minTotalPrice}&maxTotalPrice=${maxTotalPrice}`;
      } else {
        query = `?id=${id}&status=${status}&minDate=${minDate}&maxDate=${maxDate}&minTotalPrice=${minTotalPrice}&maxTotalPrice=${maxTotalPrice}`;
      }
    } else if (page === "feedback") {
      // Access form values for /dashboard/feedback page
      const username = (
        target.elements.namedItem("username") as HTMLInputElement
      ).value;
      const minDate = (target.elements.namedItem("minDate") as HTMLInputElement)
        .value;
      const maxDate = (target.elements.namedItem("maxDate") as HTMLInputElement)
        .value;
      isAdmin
        ? (query = `?username=${username}&minDate=${minDate}&maxDate=${maxDate}`)
        : (query = `?minDate=${minDate}&maxDate=${maxDate}`);
    } else if (pageProducts === "products" || page === "products") {
      // Access form values for /products page
      const productId = (
        target.elements.namedItem("productId") as HTMLInputElement
      ).value;
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
      query = `?productId=${productId}&productName=${productName}&productCategory=${productCategory}&minPrice=${minPrice}&maxPrice=${maxPrice}`;
    }
    router.push(query);
  };

  return (
    <form
      role="toolbar"
      aria-label="Filter"
      onSubmit={handleSubmit}
      className={`rounded-xl m-auto p-3 bg-gradient-to-r from-red-700 dark:from-red-800 to-red-950 dark:bg-amber-950 text-white flex gap-4 h-[80px]
        max-lg:flex-col max-lg:w-[688px] max-md:w-[327px]
        [&_input]:text-black [&_input]:rounded [&_select]:text-black [&_select]:rounded
        ${
          page === "feedback"
            ? "w-[600px] max-md:h-[325px] max-lg:h-[250px]"
            : ""
        }
        ${
          page === "customers" || page === "products"
            ? "w-[700px] max-md:h-[325px] max-lg:h-[325px]"
            : ""
        }
        ${
          page === "orders"
            ? "w-[1300px] max-md:h-[650px] max-lg:h-[400px]"
            : ""
        }
        ${
          pageProducts === "products" || page === "products"
            ? "w-[1100px] max-md:h-[500px] max-lg:h-[350px]"
            : ""
        }      
        `}
    >
      {/* Show form fields for /dashboard/products and products page */}
      {(page === "products" || pageProducts === "products") && (
        <div
          className="flex justify-center gap-4 max-lg:grid max-lg:grid-cols-2 max-lg:grid-rows-2
        max-md:grid-rows-4 max-md:grid-cols-1"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="productId">Product-Id</label>
            <input id="productId" type="text" name="productId" />
          </div>
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
              <option value="">All</option>
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="id">Order ID:</label>
            <input id="id" type="text" name="id" />
          </div>
          {isAdmin && (
            <div className="flex flex-col gap-2">
              <label htmlFor="username">Username:</label>
              <input
                id="username"
                type="text"
                name="username"
                defaultValue={username}
              />
            </div>
          )}
          <div className="flex flex-col gap-2">
            <label htmlFor="minDate">Min. Date:</label>
            <input id="minDate" type="date" name="minDate" />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="maxDate">Max. Date:</label>
            <input
              id="maxDate"
              type="date"
              name="maxDate"
              max={today}
              defaultValue={today}
            />
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
      {page === "feedback" && (
        <div
          className="flex justify-center gap-4 max-lg:grid max-lg:grid-cols-2 max-lg:grid-rows-1
          max-md:grid-rows-2 max-md:grid-cols-1"
        >
          {isAdmin && (
            <div className="flex flex-col gap-2">
              <label htmlFor="username">Username:</label>
              <input
                id="username"
                type="text"
                name="username"
                defaultValue={username}
              />
            </div>
          )}
          <div className="flex flex-col gap-2">
            <label htmlFor="minDate">Min. Date:</label>
            <input id="minDate" type="date" name="minDate" />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="maxDate">Max. Date:</label>
            <input
              id="maxDate"
              type="date"
              name="maxDate"
              max={today}
              value={today}
            />
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
