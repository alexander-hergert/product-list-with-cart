import { auth } from "@clerk/nextjs/server";
import { checkIfAdmin } from "@/lib/auth";
import dynamic from "next/dynamic";
import ThemeButton from "./ThemeButton";

const NavlinksEvents = dynamic(() => import("@/components/NavlinksEvents"), {
  ssr: false,
});

const Navbar = async () => {
  //Check if user is admin
  const { userId } = auth();
  const isAdmin: boolean = await checkIfAdmin(userId);

  return (
    <>
      <NavlinksEvents isAdmin={isAdmin} />
      <ThemeButton />
    </>
  );
};

export default Navbar;
