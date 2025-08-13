import { auth } from "@clerk/nextjs/server";
import { checkIfAdmin } from "@/lib/auth";
import dynamic from "next/dynamic";
import ThemeButton from "./ThemeButton";
import { UserButton } from "@clerk/nextjs";
import MenuButton from "./MenuButton";

const NavlinksEvents = dynamic(() => import("@/components/NavlinksEvents"), {
  ssr: false,
});

const Navbar = async () => {
  //Check if user is admin
  const { userId } = auth();
  const isAdmin: boolean = await checkIfAdmin(userId);

  return (
    <nav className="p-2 flex justify-between items-center w-full bg-gradient-to-r from-red-700 dark:from-red-800 to-red-950 text-white">
      <div className="flex items-center gap-4">
        <div className="md:hidden">
          <MenuButton />
        </div>
        <div className="max-md:hidden">
          <NavlinksEvents isAdmin={isAdmin} />
        </div>
        <div className="max-md:hidden">
          <UserButton />
        </div>
      </div>
      <div className="flex items-center">
        <ThemeButton />
      </div>
    </nav>
  );
};

export default Navbar;
