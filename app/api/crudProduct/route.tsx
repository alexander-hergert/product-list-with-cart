import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { checkIfAdmin } from "@/lib/auth";

const productSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 character"),
  category: z.string().min(3, "Category must be at least 3 character"),
  description: z.string().min(3, "Description must be at least 3 character"),
  price: z.number().int().min(1, "Price must be at least 1"),
  img: z.string(), // Add url validation later
});

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { name, category, description, price, img } = await request.json();

  //Check if user is admin
  const { userId } = auth();
  if (!(await checkIfAdmin(userId))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  //Validate the product
  try {
    const productValidate = productSchema.parse({
      name,
      category,
      description,
      price: parseInt(price),
      img,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to validate product" },
      { status: 400 }
    );
  } finally {
    await prisma.$disconnect();
  }

  //Create the product
  try {
    const newProduct = await prisma.products.create({
      data: {
        id: uuidv4(),
        name,
        category,
        description,
        price: parseInt(price),
        image: img,
        rating: 0,
      },
    });
  } catch (error) {
    console.log("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }

  return NextResponse.json({ status: 200, message: "Product created" });
}

export async function PUT(request: Request) {
  const { id, name, category, description, price, img } = await request.json();

  //Check if user is admin
  const { userId } = auth();
  if (!(await checkIfAdmin(userId))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  //Validate the product
  try {
    const productValidate = productSchema.parse({
      name,
      category,
      description,
      price: parseInt(price),
      img,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to validate product" },
      { status: 400 }
    );
  } finally {
    await prisma.$disconnect();
  }

  //Edit product
  try {
    const editetProduct = await prisma.products.update({
      where: {
        id: id,
      },
      data: {
        name,
        category,
        description,
        price: parseInt(price),
        image: img,
      },
    });
  } catch (error) {
    console.log("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }

  return NextResponse.json({ status: 200, message: "Product updated" });
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
    const deletedProduct = await prisma.products.delete({
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
