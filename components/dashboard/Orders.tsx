import { Order } from "@/lib/types";

interface OrdersProps {
  orders: Order[];
}

const Orders: React.FC<OrdersProps> = ({ orders }) => {
  return (
    <div>
      <h2>Orders</h2>
      <ul>
        {orders.map((order) => (
          <li key={order.id}>{order.totalPrice}</li>
        ))}
      </ul>
    </div>
  );
};

export default Orders;
