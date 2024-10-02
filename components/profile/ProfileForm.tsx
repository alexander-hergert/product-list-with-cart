"use client";

import { FC, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ProfileFormProps {
  name: string | undefined;
  email: string | undefined;
  address: string | undefined;
  image: string | undefined;
}

const ProfileForm: FC<ProfileFormProps> = ({ name, email, address, image }) => {
  const [input, setInput] = useState({
    name,
    email,
    address,
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (updatedData: typeof input) => {
      return await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      }).then((res) => res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error) => {
      console.error("Error updating profile:", error);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({
      ...input,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate(input);
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <label htmlFor="name">Name</label>
      <input
        type="text"
        id="name"
        defaultValue={name}
        onChange={(e) => handleChange(e)}
      />
      <label htmlFor="email">Email</label>
      <input
        type="email"
        id="email"
        defaultValue={email}
        onChange={(e) => handleChange(e)}
      />
      <label htmlFor="address">Address</label>
      <input
        type="text"
        id="address"
        defaultValue={address}
        onChange={(e) => handleChange(e)}
      />
      <button className="border" type="submit">
        Change Data
      </button>
    </form>
  );
};

export default ProfileForm;
