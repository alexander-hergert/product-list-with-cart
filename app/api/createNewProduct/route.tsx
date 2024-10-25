import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 character"),
  description: z.string().min(3, "Description must be at least 3 character"),
  price: z.number().int().min(1, "Price must be at least 1"),
  img: z.string(), // Add url validation later
});

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { name, description, price, img } = await request.json();

  //Check if user is admin
  const { userId } = auth();
  try {
    const user = await prisma.users.findFirst({
      where: {
        id: userId || "",
      },
    });
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }

  //Validate the product
  try {
    const productValidate = productSchema.parse({
      name,
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
  const { id, name, description, price, img } = await request.json();

  //Check if user is admin
  const { userId } = auth();
  try {
    const user = await prisma.users.findFirst({
      where: {
        id: userId || "",
      },
    });
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }

  //Validate the product
  try {
    const productValidate = productSchema.parse({
      name,
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
