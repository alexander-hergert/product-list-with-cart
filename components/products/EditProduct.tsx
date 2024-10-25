"use client";

import { FC, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Product } from "@/lib/types";

const productSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 character"),
  description: z.string().min(3, "Description must be at least 3 character"),
  price: z.string().min(1, "Price must be at least 1"),
  img: z.string(), // Add url validation later
});

interface EditProductProps {
  product: Product | null;
  id: string;
}

const EditProduct: FC<EditProductProps> = ({ product, id }) => {
  const { name, description, price, image } = product || {};
  const queryClient = useQueryClient();
  const router = useRouter();
  const [input, setInput] = useState<{
    id: string;
    name: string;
    description: string;
    price: number;
    img: string;
  }>({
    id: id,
    name: name || "",
    description: description || "",
    price: price || 0,
    img: image || "/images/image-waffle-desktop.jpg",
  });

  const mutation = useMutation({
    mutationFn: async (updatedData: typeof input) => {
      return await fetch("/api/createNewProduct", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      }).then((res) => res.json());
    },
    onSuccess: (data) => {
      if (data.status !== 200) {
        throw new Error(data.message);
      }
      queryClient.invalidateQueries({ queryKey: ["editProduct"] });
      console.log("Product editet:", data);
      router.push("/products");
    },
    onError: (error) => {
      console.error("Error editing Product:", error);
    },
  });

  const [errors, setErrors] = useState<{
    name?: string;
    description?: string;
    price?: number;
  }>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Validate input using Zod schema
    try {
      productSchema.parse(input);
      setErrors({});
      mutation.mutate(input);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0]] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          onChange={handleChange}
          defaultValue={name}
        />
        {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
      </div>
      <div>
        <label>Description:</label>
        <textarea
          name="description"
          onChange={handleChange}
          defaultValue={description}
        />
        {errors.description && (
          <p style={{ color: "red" }}>{errors.description}</p>
        )}
      </div>
      <div>
        <label>Price:</label>
        <input
          type="number"
          name="price"
          onChange={handleChange}
          defaultValue={price}
        />
        {errors.price && <p style={{ color: "red" }}>{errors.price}</p>}
      </div>
      <div>
        <label>Image:</label>
        <input type="file" name="image" />
      </div>
      <button type="submit">Edit Product</button>
    </form>
  );
};

export default EditProduct;
