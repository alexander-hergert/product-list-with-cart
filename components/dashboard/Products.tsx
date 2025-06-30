import { Product } from "@/lib/types";
import Link from "next/link";

interface ProductsProps {
  products: Product[];
}

const Products: React.FC<ProductsProps> = ({ products }) => {
  return (
    <Link
      href="/dashboard/products"
      className="border rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow duration-300 h-80"
    >
      <h2 className="text-xl mb-4">Products</h2>
      <ul>
        {products.map((product) => (
          <li key={product.id} className="mb-2">
            {product.name}
          </li>
        ))}
      </ul>
    </Link>
  );
};

export default Products;
