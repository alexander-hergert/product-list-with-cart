"use client";
import { CldUploadWidget } from "next-cloudinary";
import { useRouter } from "next/navigation";

const ProfileImage = () => {
  const router = useRouter();
  return (
    <CldUploadWidget
      signatureEndpoint="/api/sign-cloudinary-params"
      onSuccess={async (result) => {
        //PUT request to /api/profileImage
        await fetch("/api/profileImage", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image:
              typeof result?.info !== "string" ? result?.info?.secure_url : "",
          }),
        });
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
