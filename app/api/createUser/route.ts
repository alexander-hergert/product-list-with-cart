"use server";

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { auth, clerkClient } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { userId, sessionId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const clerkUser = userId ? await clerkClient().users.getUser(userId) : null;
    console.log(
      "Clerk user:",
      clerkUser?.firstName,
      clerkUser?.lastName,
      clerkUser?.emailAddresses[0].emailAddress
    );

    const { name, email } = await request.json();
    const image =
      "https://images.ctfassets.net/e5382hct74si/4QEuVLNyZUg5X6X4cW4pVH/eb7cd219e21b29ae976277871cd5ca4b/profile.jpg";

    const user = await prisma.users.create({
      data: { name, email, image },
    });
    revalidatePath("/api/createUser");

    const response = NextResponse.json(user, { status: 201 });
    response.headers.set(
      "Cache-Control",
      "public, max-age=10, stale-while-revalidate=30"
    );

    return response;
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
