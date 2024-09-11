"user server";

//Optional replaced with direct database query in teh component
// import { NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export async function GET(request: Request) {
//   try {
//     const products = await prisma.products.findMany();
//     return NextResponse.json(products);
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch products" },
//       { status: 500 }
//     );
//   } finally {
//     await prisma.$disconnect();
//   }
// }
