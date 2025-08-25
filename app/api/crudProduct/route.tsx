import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { checkIfAdmin } from "@/lib/auth";

const prisma = new PrismaClient();

//fetch sub_category for selectable slots
const fetchSubCategories = async () => {
  try {
    const subCategories = await prisma.products.findMany({
      distinct: ["sub_category"], // unique values only
      select: {
        sub_category: true, // only fetch sub_category
      },
      orderBy: {
        sub_category: "asc", // sort alphabetically A → Z
      },
    });

    return subCategories.map((item) => item.sub_category);
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    return [];
  } finally {
    await prisma.$disconnect();
  }
};

// build schema at runtime
const productSchema = (existingSubCategories: string[]) =>
  z
    .object({
      name: z.string().min(3, "Name must be at least 3 characters"),
      main_category: z.string().min(1, "Please select a main category"),
      sub_category: z
        .string()
        .min(1, "Sub category must be at least 1 character"),
      sub_category_new: z
        .string()
        .optional()
        .refine((val) => val === undefined || val !== "Add new", {
          message: "Sub category name cannot be 'Add new'",
        }),
      description: z
        .string()
        .min(3, "Description must be at least 3 characters"),
      price: z.number().int().min(1, "Price must be at least 1"),
      img: z.string().url("Invalid URL"),
    })
    .superRefine((data, ctx) => {
      if (data.sub_category === "Add new") {
        if (!data.sub_category_new) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["sub_category_new"],
            message: "Please provide a new sub category",
          });
        } else if (existingSubCategories.includes(data.sub_category_new)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["sub_category_new"],
            message: "This sub category already exists",
          });
        } else if (data.sub_category_new.length < 3) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["sub_category_new"],
            message: "Sub category name must be at least 3 characters",
          });
        }
      }
    });

export async function POST(request: Request) {
  const {
    name,
    main_category,
    sub_category,
    sub_category_new,
    description,
    price,
    img,
  } = await request.json();

  //Check if user is admin
  const { userId } = auth();
  if (!(await checkIfAdmin(userId))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch existing subcategories before validation
  const existingSubCategories = await fetchSubCategories();

  //Validate the product
  try {
    productSchema(existingSubCategories).parse({
      name,
      main_category,
      sub_category,
      sub_category_new,
      description,
      price: parseInt(price),
      img,
    });
    //Create product
    await prisma.products.create({
      data: {
        id: uuidv4(),
        name,
        main_category,
        sub_category:
          sub_category === "Add new" ? sub_category_new : sub_category,
        description,
        price: parseInt(price),
        image: img,
        rating: 0,
      },
    });
    return NextResponse.json({ status: 200, message: "Product created" });
  } catch (error) {
    console.log("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request: Request) {
  const { id, name, main_category, sub_category, description, price, img } =
    await request.json();

  //Check if user is admin
  const { userId } = auth();
  if (!(await checkIfAdmin(userId))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch existing subcategories before validation
  const existingSubCategories = await fetchSubCategories();

  //Validate the product
  try {
    productSchema(existingSubCategories).parse({
      name,
      main_category,
      sub_category,
      description,
      price: parseInt(price),
      img,
    });
    //Edit product
    await prisma.products.update({
      where: {
        id: id,
      },
      data: {
        name,
        main_category,
        sub_category,
        description,
        price: parseInt(price),
        image: img,
      },
    });
    return NextResponse.json({ status: 200, message: "Product updated" });
  } catch (error) {
    console.log("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request: Request) {
  const id = await request.json();

  //Check if user is admin
  const { userId } = auth();
  if (!(await checkIfAdmin(userId))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  //Delete product
  try {
    await prisma.products.delete({
      where: {
        id: id,
      },
    });
  } catch (error) {
    console.log("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }

  return NextResponse.json({ status: 200, message: "Product deleted" });
}
