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

const SignUpHandler = dynamic(() => import("@/components/SignUpHandler"), {
  ssr: false,
});

export default async function Home() {
  //   const queryClient = new QueryClient();
  //   await queryClient.prefetchQuery({
  //     queryKey: ["user"],
  //     queryFn: () => {},
  //   });

  return (
    // <HydrationBoundary state={dehydrate(queryClient)}>
    <main className="relative flex min-h-screen flex-col items-center justify-center">
      <SignUpHandler />
      <Link href="/signup">To SignUp</Link>
      <h1 className="pt-4 pb-8 bg-gradient-to-br from-black via-[#171717] to-[#575757] bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl">
        Testing Next features
      </h1>
      <Suspense fallback={<TablePlaceholder />}>
        <Table />
      </Suspense>
    </main>
    // </HydrationBoundary>
  );
}
