"use server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PUT(request: Request) {
  const { userId } = auth();
  const { image } = await request.json();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: { image },
    });
    return new NextResponse(JSON.stringify(updatedUser), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating profile image:", error);
    return new NextResponse("Failed to update profile image", { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
