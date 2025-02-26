import Link from "next/link";
import { Suspense } from "react";
import Table from "@/components/table";
import TablePlaceholder from "@/components/table-placeholder";
import dynamic from "next/dynamic";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import Image from "next/image";

//moved to layout for now
const SignUpHandler = dynamic(() => import("@/components/SignUpHandler"), {
  ssr: false,
});

export default async function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center">
      <section className="flex justify-between gap-12 max-lg:flex-col-reverse max-lg:gap-8 max-lg:items-center">
        <aside className="flex flex-col gap-4 items-center">
          <h1 className="pt-4 pb-8 bg-gradient-to-br from-black via-[#171717] to-[#575757] bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl">
            Product-List-With-Cart
          </h1>
          <h2 className="text-center text-lg font-medium text-gray-400">
            A shop to order your favorite food. Click on the cart icon to add
            items.
          </h2>
          <Link
            href="/products"
            className="block mt-4 text-center text-lg font-medium text-white bg-blue-500 w-[150px] rounded-lg p-4"
          >
            Get Started
          </Link>
        </aside>
        <Image
          className="rounded-lg"
          src="/images/image-cake-mobile.jpg"
          width={500}
          height={500}
          alt="food"
        />
      </section>
      {/* <Suspense fallback={<TablePlaceholder />}>
        <Table />
      </Suspense> */}
    </main>
  );
}
