"use server";

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth, clerkClient } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const clerkUser = userId ? await clerkClient().users.getUser(userId) : null;

    const id: string = userId;
    const name: string = clerkUser?.fullName || "Anonymous";
    const email: string | undefined =
      clerkUser?.emailAddresses[0]?.emailAddress;

    if (!email) {
      return NextResponse.json({ error: "Email not found" }, { status: 400 });
    }

    const image =
      "https://images.ctfassets.net/e5382hct74si/4QEuVLNyZUg5X6X4cW4pVH/eb7cd219e21b29ae976277871cd5ca4b/profile.jpg";

    // Check if user already exists
    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(existingUser, { status: 400 });
    }

    // Create a new user in the database
    const user = await prisma.users.create({
      data: { id, name, email, image },
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
