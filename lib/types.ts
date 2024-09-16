export type User = {
  id: string;
  name: string;
  email: string;
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

export type Order = {
  id: string;
  userId: string;
  name: string;
  email: string;
  productIds: string[];
  productIdsQuantity: number[];
  productIdsPrice: number[];
  totalPrice: number;
  createdAt: Date;
};

export type Feedback = {
  id: string;
  userId: string;
  title: string;
  productId: string;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Cart = {
  [productId: number]: {
    name: string;
    price: number;
    quantity: number;
  };
};
