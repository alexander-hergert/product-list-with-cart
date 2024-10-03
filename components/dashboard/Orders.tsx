import { Order } from "@/lib/types";
import Link from "next/link";

interface OrdersProps {
  orders: Order[];
}

const Orders: React.FC<OrdersProps> = ({ orders }) => {
  return (
    <div className="border">
      <h2>Orders</h2>
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
