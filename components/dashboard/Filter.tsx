"use client";
import { useRouter, usePathname } from "next/navigation";

const Filter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const page = pathname.split("/")[2];
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
    }
    router.push(query);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Show form fields for /dashboard/products page */}
      {page === "products" && (
        <>
          <label htmlFor="productname">Product Name:</label>
          <input id="productname" type="text" name="productname" />
          <label htmlFor="minPrice">Min. Price:</label>
          <input id="minPrice" type="number" name="minPrice" />
          <label htmlFor="maxPrice">Max. Price:</label>
          <input id="maxPrice" type="number" name="maxPrice" />
        </>
      )}
      {/** Show form fields for /dashboard/customers */}
      {page === "customers" && (
        <>
          <label htmlFor="username">Username:</label>
          <input id="username" type="text" name="username" />
          <label htmlFor="email">Email:</label>
          <input id="email" type="email" name="email" />
          <label htmlFor="address">Address:</label>
          <input id="address" type="text" name="address" />
        </>
      )}
      {/** Show form fields for /dashboard/orders */}
      {page === "orders" && (
        <>
          <label htmlFor="status">Status:</label>
          <select id="status" name="status">
            <option value="Pending">Pending</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <label htmlFor="mindate">Min. Date:</label>
          <input id="minDate" type="date" name="minDate" />
          <label htmlFor="maxDate">Max. Date:</label>
          <input id="maxDate" type="date" name="maxDate" />
          <label htmlFor="minTotalPrice">Min. Total Price:</label>
          <input id="minTotalPrice" type="number" name="minTotalPrice" />
          <label htmlFor="maxTotalPrice">Max. Total Price:</label>
          <input id="maxTotalPrice" type="number" name="maxTotalPrice" />
        </>
      )}
      {/** Show form fields for /dashboard/feedback */}
      {page === "feedback" && (
        <>
          <label htmlFor="mindate">Min. Date:</label>
          <input id="minDate" type="date" name="minDate" />
          <label htmlFor="maxDate">Max. Date:</label>
          <input id="maxDate" type="date" name="maxDate" />
        </>
      )}
      <button type="submit">Submit</button>
    </form>
  );
};

export default Filter;
