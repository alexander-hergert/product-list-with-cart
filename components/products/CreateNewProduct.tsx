"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";

const productSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 character"),
  category: z.string().min(3, "Category must be at least 3 character"),
  description: z.string().min(3, "Description must be at least 3 character"),
  price: z.string().min(1, "Price must be at least 1"),
  img: z.string().url("Invalid URL"),
});

const CreateNewProduct = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [input, setInput] = useState<{
    name: string;
    category: string;
    description: string;
    price: number;
    img: string;
  }>({
    name: "",
    category: "",
    description: "",
    price: 0,
    img: "",
  });

  const mutation = useMutation({
    mutationFn: async (updatedData: typeof input) => {
      return await fetch("/api/crudProduct", {
        method: "POST",
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
      queryClient.invalidateQueries({ queryKey: ["createNewProduct"] });
      console.log("New product created:", data);
      router.push("/products");
    },
    onError: (error) => {
      console.error("Error creating Product:", error);
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
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center border rounded-xl p-4 shadow-md md:min-w-[800px] md:w-1/2 m-auto max-md:w-[80%]"
    >
      <div
        className="flex max-md:flex-col gap-2 items-center w-[600px] justify-between
      "
      >
        <label className="text-xl w-[200px] max-md:text-center" htmlFor="name">
          Name:
        </label>
        <input
          type="text"
          id="name"
          name="name"
          onChange={handleChange}
          className="w-[300px] max-md:text-center border rounded px-2"
        />
        {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
      </div>
      <div className="flex max-md:flex-col gap-2 items-center w-[600px] justify-between my-4">
        <label
          className="text-xl w-[200px] max-md:text-center"
          htmlFor="category"
        >
          Category:
        </label>
        <input
          type="text"
          id="category"
          name="category"
          onChange={handleChange}
          className="w-[300px] max-md:text-center border rounded px-2"
        />
        {errors.category && <p style={{ color: "red" }}>{errors.category}</p>}
      </div>
      <div className="flex max-md:flex-col gap-2 items-center w-[600px] justify-between">
        <label
          className="text-xl w-[200px] max-md:text-center md:self-start"
          htmlFor="description"
        >
          Description:
        </label>
        <textarea
          id="description"
          name="description"
          onChange={handleChange}
          className="border rounded w-[300px] min-h-[200px] px-2"
        />
        {errors.description && (
          <p style={{ color: "red" }}>{errors.description}</p>
        )}
      </div>
      <div className="flex max-md:flex-col gap-2 items-center w-[600px] justify-between my-4">
        <label className="text-xl w-[200px] max-md:text-center" htmlFor="price">
          Price:
        </label>
        <input
          type="number"
          id="price"
          name="price"
          onChange={handleChange}
          className="w-[300px] max-md:text-center border rounded px-2"
        />
        {errors.price && <p style={{ color: "red" }}>{errors.price}</p>}
      </div>
      <div>
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
                className="className= border rounded p-2 my-2 hover:bg-blue-700 hover:text-white md:w-[600px] max-md:w-[300px] mt-4"
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
      <button
        type="submit"
        className="className= border rounded p-2 my-2 hover:bg-blue-700 hover:text-white md:w-[600px] max-md:w-[300px] mt-4"
      >
        Create Product
      </button>
    </form>
  );
};

export default CreateNewProduct;
