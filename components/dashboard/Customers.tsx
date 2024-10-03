import type { User } from "@/lib/types";

interface CustomersProps {
  customers: User[];
}

const Customers: React.FC<CustomersProps> = ({ customers }) => {
  return <div>
    <h2>Customers</h2>
    <ul>
      {customers.map((customer) => (
        <li key={customer.id}>{customer.name}</li>
      ))}
    </ul>
  </div>;
};

export default Customers;
