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
      const price = (target.elements.namedItem("price") as HTMLInputElement)
        .value;
      query = `?productname=${productname}&price=${price}`;
    } else {
      // Access form values for /dashboard/customers page
      const username = (
        target.elements.namedItem("username") as HTMLInputElement
      ).value;
      const email = (target.elements.namedItem("email") as HTMLInputElement)
        .value;
      const address = (target.elements.namedItem("address") as HTMLInputElement)
        .value;
      query = `?username=${username}&email=${email}&address=${address}`;
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
          <label htmlFor="price">Max. Price:</label>
          <input id="price" type="number" name="price" />
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
      <button type="submit">Submit</button>
    </form>
  );
};

export default Filter;
