"use server";

import Link from "next/link";
import dynamic from "next/dynamic";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import Image from "next/image";
import ProfileImage from "@/components/profile/ProfileImage";

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
    <main className="grid place-content-center">
      <h1 className="text-2xl font-bold my-4">Profile</h1>
      <section className="w-[800px] border rounded-xl flex justify-between max-md:flex-col max-md:w-[100%]">
        <Image
          className="rounded-xl w-[100%]"
          src={img}
          alt="Profile Image"
          width={350}
          height={350}
        />
        <div className="p-4">
          <ProfileForm {...userData} />
          <ProfileImage />
        </div>
      </section>
    </main>
  );
}
