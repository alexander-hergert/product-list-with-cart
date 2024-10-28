"use client";
import { useRouter } from "next/navigation";

const Filter = () => {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    // Access form values using names
    const name = (target.elements.namedItem("name") as HTMLInputElement).value;
    const price = (target.elements.namedItem("price") as HTMLInputElement)
      .value;
    // Build query and log
    const query = `?name=${name}&price=${price}`;
    router.push(query);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Name:</label>
      <input id="name" type="text" name="name" />
      <label htmlFor="price">Max. Price:</label>
      <input id="price" type="number" name="price" />
      <button type="submit">Submit</button>
    </form>
  );
};

export default Filter;
