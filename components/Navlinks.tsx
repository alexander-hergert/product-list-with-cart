import { auth } from "@clerk/nextjs/server";
import { checkIfAdmin } from "@/lib/auth";
import dynamic from "next/dynamic";

const NavlinksEvents = dynamic(() => import("@/components/NavlinksEvents"), {
  ssr: false,
});

const Navlinks = async () => {
  //Check if user is admin
  const { userId } = auth();
  const isAdmin: boolean = await checkIfAdmin(userId);

  return <NavlinksEvents isAdmin={isAdmin} />;
};

export default Navlinks;
