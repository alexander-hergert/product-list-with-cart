"use server";

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { User } from "@/lib/types";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { userId } = auth();
  const { name, email, address } = await request.json();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
