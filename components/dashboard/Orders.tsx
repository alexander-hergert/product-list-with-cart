import { Order } from "@/lib/types";
import Link from "next/link";

interface OrdersProps {
  orders: Order[];
}

const Orders: React.FC<OrdersProps> = ({ orders }) => {
  return (
    <Link
      href="/dashboard/orders"
      className="border rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow duration-300 h-80"
    >
      <h2 className="text-xl mb-4">Orders</h2>
      <ul>
        {orders.map((order) => (
          <li key={order.id} className="mb-2">
            Price:${order.totalPrice}
            <br />
            Id:{order.id}
          </li>
        ))}
      </ul>
    </Link>
  );
};

export default Orders;
