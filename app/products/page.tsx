import Cart from "@/components/products/Cart";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
const Modal = dynamic(() => import("@/components/products/Modal"), {
  ssr: false,
});

import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["400", "700"],
  subsets: ["latin"],
});

const category = [
  {
    name: "Breakfast",
    src: "/products/breakfast",
    image: "/images/breakfast/image-pancake-desktop.jpeg",
  },
  {
    name: "Lunch",
    src: "/products/lunch",
    image: "/images/lunch/image-caesar-salad-desktop.jpeg",
  },
  {
    name: "Dessert",
    src: "/products/dessert",
    image: "/images/desserts/image-waffle-desktop.jpg",
  },
  {
    name: "Drinks",
    src: "/products/drinks",
    image: "/images/drinks/image-espresso-desktop.jpeg",
  },
  {
    name: "Menu",
    src: "/products/menu",
    image: "/images/menu/image-classic-breakfast-desktop.jpeg",
  },
];

export default function ProductsPage() {
  return (
    <>
      <Modal />
      <div>
        <div
          className="flex m-auto gap-8 w-[1216px] mt-4 max-lg:flex-col max-lg:w-[688px] max-lg:items-center
        max-md:w-[327px] max-md:block max-md:m-auto"
        >
          <section className="grid grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 gap-4 max-md:mb-4">
            <h1 className="text-4xl text-center col-span-full my-4 font-bold font-sans">
              Welcome, please select your category.
            </h1>
            {category.map((singleCathegory) => (
              <div key={singleCathegory.name}>
                <Link href={singleCathegory.src}>
                  <div className="bg-white group w-[250px] max-lg:w-[213px] max-md:w-[327px] overflow-hidden shadow-lg transition-transform duration-300 hover:shadow-xl hover:scale-105 rounded-lg cursor-pointer">
                    <Image
                      className="w-full object-cover aspect-square rounded-t-lg"
                      src={
                        singleCathegory.image || "/path/to/fallback/image.jpg"
                      }
                      width={200}
                      height={200}
                      alt={singleCathegory.name || "Fallback Image"}
                    />
                  </div>
                </Link>
                <h2 className="mt-4 text-center font-bold text-xl">
                  {singleCathegory.name}
                </h2>
              </div>
            ))}
          </section>
          <Cart />
        </div>
      </div>
    </>
  );
}
