"use client";

import { FC, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { string, z } from "zod";
import { useRouter } from "next/navigation";
import { Product } from "@/lib/types";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";

const productSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 character"),
  category: z.string().min(3, "Category must be at least 3 character"),
  description: z.string().min(3, "Description must be at least 3 character"),
  price: z.string().min(1, "Price must be at least 1"),
  img: z.string().url("Invalid URL"),
});

interface EditProductProps {
  product: Product | null;
  id: string;
}

const EditProduct: FC<EditProductProps> = ({ product, id }) => {
  const { name, category, description, price, image } = product || {};
  const queryClient = useQueryClient();
  const router = useRouter();
  const [input, setInput] = useState<{
    id: string;
    name: string;
    category: string;
    description: string;
    price: number;
    img: string;
  }>({
    id: id,
    name: name || "",
    category: category || "",
    description: description || "",
    price: price || 0,
    img: image || "",
  });

  const mutation = useMutation({
    mutationFn: async (updatedData: typeof input) => {
      return await fetch("/api/crudProduct", {
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
    category?: string;
    description?: string;
    price?: number;
    img?: string;
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
        <label>Category:</label>
        <input
          type="text"
          name="category"
          onChange={handleChange}
          defaultValue={category}
        />
        {errors.category && <p style={{ color: "red" }}>{errors.category}</p>}
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
        <CldUploadWidget
          signatureEndpoint="/api/sign-cloudinary-params"
          onSuccess={(result) => {
            if (typeof result.info !== "string") {
              setInput({ ...input, img: result?.info?.secure_url || "" });
            } else {
              console.error(
                "Unexpected type: result.info is a string, not an object."
              );
            }
          }}
        >
          {({ open }) => {
            return (
              <button
                name="img"
                onClick={(e) => {
                  e.preventDefault;
                  open();
                }}
              >
                Upload an Image
              </button>
            );
          }}
        </CldUploadWidget>
        {input.img && (
          <div>
            <label>Preview:</label>
            <Image src={input.img} alt="Product" width={100} height={100} />
          </div>
        )}
        {errors.img && <p style={{ color: "red" }}>{errors.img}</p>}
      </div>
      <button type="submit">Edit Product</button>
    </form>
  );
};

export default EditProduct;
