import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

const feedbackSchema = z.object({
  orderId: z.string(),
  productId: z.string(),
  rating: z.number().int().min(1, "Rating must be at least 1"),
  title: z.string().min(3, "Title must be at least 3 character"),
  comment: z.string().min(3, "Comment must be at least 3 character"),
});

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { productId, orderId, rating, title, comment } = await request.json();

  //Verify that the user is owner of the order
  const order = await prisma.orders.findFirst({
    where: {
      id: orderId,
      userId,
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  //Check if order already contains feedback for product
  const feedbackExists = await prisma.feedbacks.findFirst({
    where: {
      productId,
      orderId,
    },
  });

  if (feedbackExists) {
    return NextResponse.json(
      { error: "Feedback already exists for this product" },
      { status: 400 }
    );
  }

  // Validate the order
  try {
    const feedbackValidate = feedbackSchema.parse({
      productId,
      orderId,
      rating,
      title,
      comment,
    });
  } catch (error) {
    console.error("Error validating order:", error);
    return NextResponse.json(
      { error: "Failed to validate order" },
      { status: 400 }
    );
  }

  // Create feedback
  const feedback = await prisma.feedbacks.create({
    data: {
      id: uuidv4(),
      userId,
      productId,
      orderId,
      rating,
      title,
      comment,
      updatedAt: new Date(),
    },
  });

  // Update product rating
  // Get all feedbacks for the product
  const feedbacks = await prisma.feedbacks.findMany({
    where: {
      productId,
    },
  });
  // Calculate the average rating
  const totalRating = feedbacks.reduce((acc, feedback) => {
    return acc + feedback.rating;
  }, 0);
  const averageRating = totalRating / feedbacks.length;

  // Update the product rating
  await prisma.products.update({
    where: {
      id: productId,
    },
    data: {
      rating: averageRating,
    },
  });

  return NextResponse.json({ message: "Feedback created", status: 200 });
}
