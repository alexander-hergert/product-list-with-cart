import Link from "next/link";
export default function OrderDetailsPage() {
  return (
    <div>
      <h1>Order Details</h1>
      <br />
      <Link
        className="text-blue-500 hover:text-blue-700"
        href="/dashboard/orders"
      >
        ... Back to Orders
      </Link>
    </div>
  );
}
