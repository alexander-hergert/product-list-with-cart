"use server";

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { User } from "@/lib/types";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const clerkUser = userId ? await clerkClient().users.getUser(userId) : null;

    const userInput: User = {
      id: userId,
      role: "USER",
      name: clerkUser?.fullName || "Unknown",
      email: clerkUser?.emailAddresses[0]?.emailAddress || "Unknown",
      address: "Unknown",
      image: clerkUser?.imageUrl || "/images/default-avatar.png",
    };

    const { id, role, name, email, address, image } = userInput;

    if (!email) {
      return NextResponse.json({ error: "Email not found" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser: User | null = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(existingUser, { status: 400 });
    }

    // Create a new user in the database
    const user = await prisma.users.create({
      data: { id, role, name, email, address, image },
    });

    const response = NextResponse.json(user, { status: 201 });
    return response;
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
