"use server";

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  address: z.string().min(5, "Address must be at least 5 characters"),
});

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { userId } = auth();
  const { name, email, address } = await request.json();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Validate the profile
  try {
    const profileValidate = profileSchema.parse({
      name,
      email,
      address,
    });
  } catch (error) {
    console.error("Error validating profile:", error);
    return NextResponse.json(
      { error: "Failed to validate profile" },
      { status: 400 }
    );
  }

  try {
    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: { name, email, address },
    });
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
  return NextResponse.json({ message: "Profile updated successfully!" });
}
