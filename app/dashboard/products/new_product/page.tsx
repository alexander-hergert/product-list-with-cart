import dynamic from "next/dynamic";
import { auth } from "@clerk/nextjs/server";
import { checkIfAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";

const CreateNewProduct = dynamic(
  () => import("@/components/products/CreateNewProduct"),
  {
    ssr: false,
  }
);

const NewProductPage = async () => {
  const { userId } = auth();
  //Check if user is admin
  if (!(await checkIfAdmin(userId))) {
    redirect("/dashboard");
  }
  return (
    <div>
      <h1 className="text-2xl mb-4 text-center">Create New Product</h1>
      <CreateNewProduct />
    </div>
  );
};

export default NewProductPage;
