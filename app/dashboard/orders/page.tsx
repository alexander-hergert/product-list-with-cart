import Link from "next/link";
export default function OrdersPage() {
  return (
    <div>
      <h1>Orders</h1>
      <br />
      <Link className="text-blue-500 hover:text-blue-700" href="/dashboard">
        To Dashboard
      </Link>
    </div>
  );
}
