// This component will be used to execute custom logic after a user signs up.
// It will create a new user in the database if the user does not already exist.

"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUpHandler() {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();
  const createdUser = localStorage.getItem("createdUser");

  const handlePostSignUp = async () => {
    if (createdUser) return;
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        console.log(response);
        console.log("Custom logic executed successfully");
        localStorage.setItem("createdUser", "true");
        router.push("/success");
      } else {
        console.error("Failed to execute custom logic");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (isLoaded && userId) {
      handlePostSignUp();
    }
  }, [isLoaded, userId]);

  return <></>;
}
