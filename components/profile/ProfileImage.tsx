"use client";
import { CldUploadWidget } from "next-cloudinary";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useClerk } from "@clerk/nextjs";

const ProfileImage = () => {
  const router = useRouter();
  const { userId } = useAuth();
  const clerk = useClerk();
  return (
    <CldUploadWidget
      signatureEndpoint="/api/sign-cloudinary-params"
      onSuccess={async (result) => {
        const info = result?.info;
        const secureUrl =
          typeof info === "string" ? "" : info?.secure_url || "";
        //PUT request to /api/profileImage
        await fetch("/api/profileImage", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image: secureUrl,
          }),
        });
        //Update for clerk
        //Creating file
        const res = await fetch(secureUrl);
        const blob = await res.blob();
        const file = new File([blob], "profile-pic.png", { type: blob.type });
        if (clerk.user) {
          await clerk.user.setProfileImage({ file });
        }
        router.refresh();
      }}
    >
      {({ open }) => {
        return (
          <button
            className="border rounded p-2 my-2 hover:bg-black hover:text-white"
            onClick={() => open()}
          >
            Upload an Image
          </button>
        );
      }}
    </CldUploadWidget>
  );
};

export default ProfileImage;
