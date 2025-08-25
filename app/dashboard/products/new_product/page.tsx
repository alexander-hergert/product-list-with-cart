import { auth } from "@clerk/nextjs/server";
import { checkIfAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import CreateNewProduct from "@/components/products/CreateNewProduct";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//fetch sub_category for selectable slots
const fetchSubCategories = async () => {
  try {
    const subCategories = await prisma.products.findMany({
      distinct: ["sub_category"], // unique values only
      select: {
        sub_category: true, // only fetch sub_category
      },
      orderBy: {
        sub_category: "asc", // sort alphabetically A → Z
      },
    });

    return subCategories.map((item) => item.sub_category);
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    return [];
  } finally {
    await prisma.$disconnect();
  }
};

const NewProductPage = async () => {
  const { userId } = auth();
  //Check if user is admin
  if (!(await checkIfAdmin(userId))) {
    redirect("/dashboard");
  }
  const subCategories = await fetchSubCategories();
  return (
    <div>
      <h1 className="text-2xl my-4 text-center font-bold">
        Create New Product
      </h1>
      <CreateNewProduct subCategories={subCategories} />
    </div>
  );
};

export default NewProductPage;
