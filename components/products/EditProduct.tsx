"use client";

import { FC, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Product } from "@/lib/types";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";

// build schema at runtime based on existing subCategories
const productSchema = (subCategories: string[]) =>
  z
    .object({
      id: z.string().min(1, "Missing product ID"),
      name: z.string().min(3, "Name must be at least 3 characters"),
      main_category: z.string().min(1, "Please select a main category"),
      sub_category: z.string().min(1, "Please select a sub category"),
      sub_category_new: z
        .string()
        .optional()
        .refine((val) => val === undefined || val !== "Add new", {
          message: "Sub category name cannot be 'Add new'",
        }),
      description: z
        .string()
        .min(3, "Description must be at least 3 characters"),
      // Coerce string -> number and validate
      price: z.preprocess((val) => {
        if (typeof val === "string") {
          const n = Number(val);
          return Number.isFinite(n) ? n : val;
        }
        return val;
      }, z.number().positive("Price must be greater than 0")),
      img: z.string().url("Invalid URL"),
    })
    .superRefine((data, ctx) => {
      if (data.sub_category === "Add new") {
        const newVal = data.sub_category_new?.trim();
        if (!newVal) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["sub_category_new"],
            message: "Please enter a new sub category",
          });
        }
        // min 3 chars if "Add new"
        else if (newVal && newVal.length < 3) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["sub_category_new"],
            message: "Sub category name must be at least 3 characters",
          });
        } else if (
          subCategories
            .map((s) => s.toLowerCase().trim())
            .includes(newVal.toLowerCase())
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["sub_category_new"],
            message: "This sub category already exists",
          });
        }
      }
    });

interface EditProductProps {
  product: Product | null;
  id: string;
  subCategories: string[];
}

const EditProduct: FC<EditProductProps> = ({ product, id, subCategories }) => {
  const { name, main_category, sub_category, description, price, image } =
    product || {};
  const queryClient = useQueryClient();
  const router = useRouter();
  const [input, setInput] = useState<{
    id: string;
    name: string;
    main_category: string;
    sub_category: string;
    sub_category_new?: string;
    description: string;
    price: number;
    img: string;
  }>({
    id: id,
    name: name || "",
    main_category: main_category || "",
    sub_category: sub_category || "",
    sub_category_new: "",
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
    id?: string;
    name?: string;
    main_category?: string;
    sub_category?: string;
    sub_category_new?: string;
    description?: string;
    price?: number;
    img?: string;
  }>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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
      // Validate and coerce with Zod
      const parsed = productSchema(subCategories).parse(input);
      setErrors({});
      mutation.mutate(parsed);
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
          defaultValue={name}
          className="w-[300px] max-md:text-center border rounded px-2"
        />
      </div>
      <div>{errors.name && <p style={{ color: "red" }}>{errors.name}</p>}</div>
      <div
        className="flex max-md:flex-col gap-2 items-center w-[600px] justify-between my-4
      "
      >
        <label
          className="text-xl w-[200px] max-md:text-center"
          htmlFor="main_category"
        >
          Main Category:
        </label>
        <select
          id="main_category"
          name="main_category"
          onChange={handleChange}
          defaultValue={main_category}
          className="w-[300px] max-md:text-center border rounded px-2"
        >
          <option value="Breakfast">Breakfast</option>
          <option value="Lunch">Lunch</option>
          <option value="Dessert">Dessert</option>
          <option value="Drinks">Drinks</option>
          <option value="Menu">Menu</option>
        </select>
      </div>
      <div>
        {errors.main_category && (
          <p style={{ color: "red" }}>{errors.main_category}</p>
        )}
      </div>
      <div
        className="flex max-md:flex-col gap-2 items-center w-[600px] justify-between mb-4
      "
      >
        <label
          className="text-xl w-[200px] max-md:text-center"
          htmlFor="sub_category"
        >
          Sub Category:
        </label>
        <select
          id="sub_category"
          name="sub_category"
          onChange={handleChange}
          defaultValue={sub_category}
          className="w-[300px] max-md:text-center border rounded px-2"
        >
          <option value="Add new">Add new sub category</option>
          {subCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <div>
        {errors.sub_category && (
          <p style={{ color: "red" }}>{errors.sub_category}</p>
        )}
      </div>
      {input.sub_category === "Add new" && (
        <div className="flex max-md:flex-col gap-2 items-center w-[600px] justify-between mb-4">
          <label
            className="text-xl w-[200px] max-md:text-center"
            htmlFor="sub_category_new"
          >
            New Sub Category:
          </label>
          <input
            id="sub_category_new"
            type="text"
            name="sub_category_new"
            value={input.sub_category_new}
            onChange={handleChange}
            className="w-[300px] max-md:text-center border rounded px-2"
          />
        </div>
      )}
      <div>
        {errors.sub_category_new && (
          <p style={{ color: "red" }}>{errors.sub_category_new}</p>
        )}
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
          defaultValue={description}
          className="border rounded w-[300px] min-h-[200px] px-2"
        />
      </div>
      <div>
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
          inputMode="decimal"
          step="0.01"
          onChange={handleChange}
          defaultValue={price}
          value={input.price}
          className="w-[300px] max-md:text-center border rounded px-2"
        />
      </div>
      <div>
        {errors.price && <p style={{ color: "red" }}>{errors.price}</p>}
      </div>
      <div>
        <CldUploadWidget
          signatureEndpoint="/api/sign-cloudinary-params"
          onSuccess={(result) => {
            const secureUrl = (result.info as any)?.secure_url;
            if (typeof secureUrl === "string") {
              setInput((prev) => ({
                ...prev,
                img: secureUrl,
              }));
            } else {
              console.error("Unexpected result format:", result.info);
            }
          }}
        >
          {({ open }) => {
            return (
              <button
                className="className= border rounded p-2 my-2 hover:bg-blue-700 hover:text-white md:w-[600px] max-md:w-[300px] mt-4"
                name="img"
                type="button"
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
          <div className="flex max-md:flex-col gap-2 items-center md:w-[600px] max-md:w-[300px] justify-between my-4">
            <label className="text-xl w-[200px] max-md:text-center">
              Preview:
            </label>
            <Image
              className="rounded-xl"
              src={input.img}
              alt="Product"
              width={200}
              height={200}
            />
          </div>
        )}
      </div>
      <div>{errors.img && <p style={{ color: "red" }}>{errors.img}</p>}</div>
      <button
        type="submit"
        className="className= border rounded p-2 my-2 hover:bg-blue-700 hover:text-white md:w-[600px] max-md:w-[300px] mt-4"
      >
        Edit Product
      </button>
    </form>
  );
};

export default EditProduct;
