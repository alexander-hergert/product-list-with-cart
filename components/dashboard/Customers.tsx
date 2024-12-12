import type { User } from "@/lib/types";
import Link from "next/link";

interface CustomersProps {
  customers: User[];
}

const Customers: React.FC<CustomersProps> = ({ customers }) => {
  return (
    <Link
      href="/dashboard/customers"
      className="border rounded-xl p-4 shadow-md"
    >
      <h2 className="text-xl mb-4">Customers</h2>
      <ul>
        {customers.map((customer) => (
          <li key={customer.id}>{customer.name}</li>
        ))}
      </ul>
      <a
        className="text-blue-500 hover:text-blue-700"
        href="/dashboard/customers"
      >
        ... see more
      </a>
    </Link>
  );
};

export default Customers;
