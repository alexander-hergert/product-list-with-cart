// This component will be used to execute custom logic after a user signs up.
// It will create a new user in the database if the user does not already exist.

"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";

export default function SignUpPage() {
  const { isLoaded, userId } = useAuth();

  useEffect(() => {
    if (isLoaded && userId) {
      handlePostSignUp();
    }
  }, [isLoaded, userId]);

  const handlePostSignUp = async () => {
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        console.log("Custom logic executed successfully");
      } else {
        console.error("Failed to execute custom logic");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return <></>;
}
