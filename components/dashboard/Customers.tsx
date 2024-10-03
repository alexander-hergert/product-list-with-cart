import type { User } from "@/lib/types";
import Link from "next/link";

interface CustomersProps {
  customers: User[];
}

const Customers: React.FC<CustomersProps> = ({ customers }) => {
  return (
    <div className="border">
      <h2>Customers</h2>
      <ul>
        {customers.map((customer) => (
          <li key={customer.id}>{customer.name}</li>
        ))}
      </ul>
      <Link
        className="text-blue-500 hover:text-blue-700"
        href="/dashboard/customers"
      >
        ... see more
      </Link>
    </div>
  );
};

export default Customers;
