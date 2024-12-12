import { Product } from "@/lib/types";
import Link from "next/link";

interface ProductsProps {
  products: Product[];
}

const Products: React.FC<ProductsProps> = ({ products }) => {
  return (
    <div className="border rounded-xl p-4 shadow-md">
      <h2 className="text-xl mb-4">Products</h2>
      <ul>
        {products.map((product) => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
      <Link
        className="text-blue-500 hover:text-blue-700"
        href="/dashboard/products"
      >
        ... see more
      </Link>
    </div>
  );
};

export default Products;
