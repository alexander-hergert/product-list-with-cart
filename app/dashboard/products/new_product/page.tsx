import dynamic from "next/dynamic";
const CreateNewProduct = dynamic(
  () => import("@/components/products/CreateNewProduct"),
  {
    ssr: false,
  }
);

const NewProductPage = () => {
  return (
    <div>
      <h1>Create New Product</h1>
      <CreateNewProduct />
    </div>
  );
};

export default NewProductPage;
