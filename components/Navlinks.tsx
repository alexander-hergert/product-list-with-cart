import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { checkIfAdmin } from "@/lib/auth";

const Navlinks = async () => {
  //Check if user is admin
  const { userId } = auth();
  const isAdmin = await checkIfAdmin(userId);

  const links = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dashboard/profile", label: "Profile" },
    { href: "/dashboard/orders", label: "Orders" },
    { href: "/dashboard/feedback", label: "Feedback" },
    { href: "/dashboard/customers", label: "Customers" },
    { href: "/dashboard/products", label: "Products" },
  ];
  return (
    <div className="flex gap-2">
      {links.map(({ href, label }, i) =>
        isAdmin || (!isAdmin && i < 4) ? (
          <Link
            className="text-blue-500 hover:text-blue-700"
            key={`${href}${label}`}
            href={href}
          >
            {label}
          </Link>
        ) : null
      )}
    </div>
  );
};

export default Navlinks;
