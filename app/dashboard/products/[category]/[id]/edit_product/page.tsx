import { PrismaClient } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
import { checkIfAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import EditProduct from "@/components/products/EditProduct";

const prisma = new PrismaClient();

const fetchProduct = async (id: string) => {
  const { userId } = auth();
  //Check if user is admin
  if (!(await checkIfAdmin(userId))) {
    redirect("/dashboard");
  }
  try {
    const product = await prisma.products.findUnique({
      where: {
        id,
      },
    });
    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
};

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

interface EditProductPageProps {
  params: {
    id: string;
  };
}

const EditProductPage = async ({ params }: EditProductPageProps) => {
  const { id } = params;
  const product = await fetchProduct(id);
  const subCategories = await fetchSubCategories();
  return (
    <div>
      <h1 className="text-2xl my-4 text-center font-bold">Edit Product</h1>
      <EditProduct product={product} id={id} subCategories={subCategories} />
    </div>
  );
};

export default EditProductPage;
