import Link from "next/link";
import dynamic from "next/dynamic";
import Image from "next/image";
import AnimatedImageContainer from "@/components/AnimatedImageContainer";

//moved to layout for now
const SignUpHandler = dynamic(() => import("@/components/SignUpHandler"), {
  ssr: false,
});

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <section className="flex justify-between gap-12 max-lg:flex-col-reverse max-lg:gap-8 max-lg:items-center">
        <aside className="flex flex-col gap-4 items-center max-w-[600px] max-lg:text-center">
          <h1 className="text-black dark:text-white drop-shadow-lg pt-4 pb-8 bg-gradient-to-br from-black via-[#171717] to-[#575757] bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl">
            Your Daily Cravings, Delivered
          </h1>
          <h2 className="text-center text-lg font-medium text-gray-400">
            From indulgent cakes and refreshing juices to hearty breakfasts and
            sweet treats — discover delicious food for every moment of your day.
          </h2>
          <Link
            href="/products"
            className="block mt-4 text-center text-lg font-medium text-white bg-blue-500 w-[200px] rounded-lg p-4"
          >
            Explore the Shop
          </Link>
        </aside>
        <AnimatedImageContainer />
      </section>
    </main>
  );
}
