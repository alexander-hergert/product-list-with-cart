export type User = {
  id: string;
  role: string;
  name: string;
  email: string;
  address: string;
  image: string;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  rating: number;
};

enum OrderStatus {
  Pending = "Pending",
  Shipped = "Shipped",
  Delivered = "Delivered",
  Cancelled = "Cancelled",
}

export type Order = {
  id: string;
  userId: string;
  productIds: string[];
  productIdsQuantity: number[];
  productIdsPrice: number[];
  totalPrice: number;
  createdAt: Date;
  status: OrderStatus;
};

export type Feedback = {
  id: string;
  userId: string;
  orderId: string;
  title: string;
  productId: string;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Cart = {
  [productId: string]: {
    name: string;
    price: number;
    quantity: number;
  };
};

export type DashboardData = {
  customers: User[];
  products: Product[];
  orders: Order[];
  feedbacks: Feedback[];
};
