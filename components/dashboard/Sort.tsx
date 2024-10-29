"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
const Sort = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const page = pathname.split("/")[2];
  let query = "";

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    const target = e.target;
    if (page === "products") {
      const productname = searchParams.get("productname") || "";
      const price = searchParams.get("price") || "";
      const order = target.value;
      query = `?productname=${productname}&price=${price}&order=${order}`;
    } else {
      const username = searchParams.get("username") || "";
      const email = searchParams.get("email") || "";
      const address = searchParams.get("address") || "";
      const order = target.value;
      query = `?username=${username}&email=${email}&address=${address}&order=${order}`;
    }
    router.push(query);
  };
  return (
    <select id="order" name="order" onChange={handleChange}>
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
    </select>
  );
};

export default Sort;
