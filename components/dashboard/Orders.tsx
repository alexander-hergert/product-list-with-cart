import { Order } from "@/lib/types";
import Link from "next/link";

interface OrdersProps {
  orders: Order[];
}

const Orders: React.FC<OrdersProps> = ({ orders }) => {
  return (
    <div className="border rounded-xl p-4 shadow-md">
      <h2 className="text-xl mb-4">Orders</h2>
      <ul>
        {orders.map((order) => (
          <li key={order.id}>{order.totalPrice}</li>
        ))}
      </ul>
      <Link
        className="text-blue-500 hover:text-blue-700"
        href="/dashboard/orders"
      >
        ... see more
      </Link>
    </div>
  );
};

export default Orders;
