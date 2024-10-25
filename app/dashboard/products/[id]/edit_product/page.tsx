import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import dynamic from "next/dynamic";
const EditProduct = dynamic(() => import("@/components/products/EditProduct"), {
  ssr: false,
});

const fetchProduct = async (id: string) => {
  try {
    const product = await prisma.products.findUnique({
      where: {
        id: id,
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

interface EditProductPageProps {
  params: {
    id: string;
  };
}

const EditProductPage = async ({ params }: EditProductPageProps) => {
  const { id } = params;
  const product = await fetchProduct(id);
  return (
    <div>
      <h1>Edit Product</h1>
      <EditProduct product={product} id={id}/>
    </div>
  );
};

export default EditProductPage;
