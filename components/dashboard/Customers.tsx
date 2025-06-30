import type { User } from "@/lib/types";
import Link from "next/link";

interface CustomersProps {
  customers: User[];
}

const Customers: React.FC<CustomersProps> = ({ customers }) => {
  return (
    <Link
      href="/dashboard/customers"
      className="border rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow duration-300 h-80"
    >
      <h2 className="text-xl mb-4">Customers</h2>
      <ul>
        {customers.map((customer) => (
          <li key={customer.id} className="mb-2">
            {customer.name}
          </li>
        ))}
      </ul>
    </Link>
  );
};

export default Customers;
