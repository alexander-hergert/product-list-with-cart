import Link from "next/link";
export default function ProductDetailsPage() {
  return (
    <div>
      <h1>Customer Details</h1>
      <br />
      <Link
        className="text-blue-500 hover:text-blue-700"
        href="/dashboard/customers"
      >
        ... Back to Customers
      </Link>
    </div>
  );
}
