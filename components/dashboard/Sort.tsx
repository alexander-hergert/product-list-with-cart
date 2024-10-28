"use client";
import { useRouter, useSearchParams } from "next/navigation";
const Sort = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    const target = e.target;
    const name = searchParams.get("name") || "";
    const price = searchParams.get("price") || "";
    // // Access form values using names
    const order = target.value;
    // Build query and log
    const query = `?name=${name}&price=${price}&order=${order}`;
    router.push(query);
  };
  return (
    <select id="order" name="order" onChange={handleChange}>
      <option value="nameAsc">Name ascending</option>
      <option value="nameDesc">Name descending</option>
      <option value="priceAsc">Price ascending</option>
      <option value="priceDesc">Price descending</option>
    </select>
  );
};

export default Sort;
