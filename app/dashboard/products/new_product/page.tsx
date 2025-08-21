import { auth } from "@clerk/nextjs/server";
import { checkIfAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import CreateNewProduct from "@/components/products/CreateNewProduct";

const NewProductPage = async () => {
  const { userId } = auth();
  //Check if user is admin
  if (!(await checkIfAdmin(userId))) {
    redirect("/dashboard");
  }
  return (
    <div>
      <h1 className="text-2xl my-4 text-center font-bold">
        Create New Product
      </h1>
      <CreateNewProduct />
    </div>
  );
};

export default NewProductPage;
