"use server";

import Link from "next/link";
import dynamic from "next/dynamic";
import { auth, clerkClient } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import Image from "next/image";

const ProfileForm = dynamic(() => import("@/components/profile/ProfileForm"), {
  ssr: false,
});

export default async function ProfilePage() {
  const { userId } = auth();
  const id = userId || undefined;

  const user = await prisma.users.findUnique({
    where: {
      id: id,
    },
  });

  const userData = {
    name: user?.name,
    email: user?.email,
    address: user?.address,
    image: user?.image,
  };

  const img = user?.image || "/default.png";

  return (
    <div>
      <h1>Profile</h1>
      <Image src={img} alt="Profile Image" width={200} height={200} />
      <ProfileForm {...userData} />
      <Link href="/">To Home</Link>
    </div>
  );
}
