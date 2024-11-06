"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//Check if user is admin
export const checkIfAdmin = async (userId: string | null): Promise<boolean> => {
  try {
    const user = await prisma.users.findUnique({
      where: { id: userId || undefined },
    });
    return user?.role === "ADMIN";
  } catch (error) {
    console.error("Error fetching user:", error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
};
