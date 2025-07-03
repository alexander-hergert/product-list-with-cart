"use client";
import Link from "next/link";
import { useState } from "react";

type NavlinksEventsProps = {
  isAdmin: boolean | undefined;
};

const NavlinksEvents = ({ isAdmin }: NavlinksEventsProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dashboard/profile", label: "Profile" },
    { href: "/dashboard/orders", label: "Orders" },
    { href: "/dashboard/feedback", label: "Feedback" },
    { href: "/dashboard/customers", label: "Customers" },
    { href: "/dashboard/products", label: "ProductsAdmin" },
  ];

  const productLinks = [
    { href: "/products/breakfast", label: "Breakfast" },
    { href: "/products/lunch", label: "Lunch" },
    { href: "/products/dessert", label: "Dessert" },
    { href: "/products/drinks", label: "Drinks" },
    { href: "/products/menu", label: "Menu" },
  ];

  const handleMousehover = (e: React.MouseEvent) => {
    const target = e.target as HTMLAnchorElement;
    if (target.textContent === "Products") {
      setIsHovered(true);
      target.style.textDecoration = "underline";
    }
  };
  const handleMouseleave = (e: React.MouseEvent) => {
    const target = e.target as HTMLAnchorElement;
    if (target.textContent === "Products") {
      target.style.textDecoration = "none";
    }
  };

  const handleLeaveBox = () => {
    setIsHovered(false);
  };

  return (
    <>
      <div className="flex gap-2">
        {links.map(({ href, label }, i) =>
          isAdmin || (!isAdmin && i < 6) ? (
            <Link
              onMouseEnter={handleMousehover}
              onMouseLeave={handleMouseleave}
              className="text-blue-500 hover:text-blue-700"
              key={`${href}${label}`}
              href={href}
            >
              {label}
            </Link>
          ) : null
        )}
      </div>
      {isHovered && (
        <div
          onMouseLeave={handleLeaveBox}
          className="absolute top-6 left-20 bg-white shadow-lg p-4 rounded-md"
        >
          <h2 className="text-lg font-bold">Products</h2>
          <ul>
            {productLinks.map(({ href, label }) => (
              <li key={href} className="text-blue-500 hover:text-blue-700">
                <Link href={href}>{label}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default NavlinksEvents;
