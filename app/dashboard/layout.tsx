import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();

  // If the user is not authenticated, redirect to the home page
  if (!userId) {
    redirect("/");
  }

  return <>{children}</>;
}
