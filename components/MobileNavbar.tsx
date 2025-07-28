"use client";

import React from "react";
import { useContext } from "react";
import { MenuContext } from "@/lib/menuContext";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

const MobileNavbar = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error("MobileNavbar must be used within a MenuProvider");
  }
  const { isMenuOpen, setIsMenuOpen } = context;

  return (
    <>
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-end md:hidden"
          style={{
            background: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(2px)",
          }}
        >
          {/* Modal Content */}
          <div className="w-4/5 max-w-xs h-full bg-white dark:dark:bg-slate-200 shadow-xl flex flex-col p-6 text-black">
            {/* Header Placeholder */}
            <div className="mb-6 flex justify-between items-center">
              <span className="text-xl font-bold">Daily Cravings</span>
              <button
                aria-label="Close Menu"
                className="text-2xl font-bold"
                onClick={() => setIsMenuOpen(false)}
              >
                &times;
              </button>
            </div>
            <div className="grid my-4 border-y py-2 border-black place-items-start">
              <UserButton />
            </div>
            <nav className="flex-1 flex flex-col gap-4">
              <Link href="/" className="text-lg font-medium">
                Home
              </Link>
              <Link href="/products" className="text-lg font-medium">
                Products
              </Link>
              <Link href="/dashboard" className="text-lg font-medium">
                Dashboard
              </Link>
              <Link href="/dashboard/profile" className="text-lg font-medium">
                Profile
              </Link>
              <Link href="/dashboard/orders" className="text-lg font-medium">
                Orders
              </Link>
              <Link href="/dashboard/feedback" className="text-lg font-medium">
                Feedback
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileNavbar;
