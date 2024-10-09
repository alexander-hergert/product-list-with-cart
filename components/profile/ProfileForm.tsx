"use client";

import { FC, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  address: z.string().min(5, "Address must be at least 5 characters"),
});

interface ProfileInput {
  name: string | undefined;
  email: string | undefined;
  address: string | undefined;
}

const ProfileForm: FC<ProfileInput> = ({ name, email, address }) => {
  const [input, setInput] = useState<ProfileInput>({
    name,
    email,
    address,
  });

  const [errors, setErrors] = useState<ProfileInput>({
    name: "",
    email: "",
    address: "",
  });

  const queryClient = useQueryClient();
  const [data, setData] = useState({ name, email, address });

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
      if (data.error) {
        throw new Error(data.error);
      }
      setData(data);
    },
    onError: (error) => {
      setData({ name, email, address });
      console.log(error.message);
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
    // Validate input using Zod
    const validationResult = profileSchema.safeParse(input);
    if (!validationResult.success) {
      // Collect errors and set them to state
      const newErrors = validationResult.error.formErrors.fieldErrors;
      setErrors({
        name: newErrors.name?.[0],
        email: newErrors.email?.[0],
        address: newErrors.address?.[0],
      });
      return;
    }
    // If validation passes, clear errors and submit
    setErrors({ name: "", email: "", address: "" });
    mutation.mutate(input);
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <div className="flex gap-4 items-center">
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          defaultValue={name || data?.name}
          onChange={(e) => handleChange(e)}
        />
        {errors.name && <p className="text-red-500">{errors.name}</p>}
      </div>
      <div className="flex gap-4 items-center">
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          defaultValue={email || data?.email}
          onChange={(e) => handleChange(e)}
        />
        {errors.email && <p className="text-red-500">{errors.email}</p>}
      </div>
      <div className="flex gap-4 items-center">
        <label htmlFor="address">Address:</label>
        <input
          type="text"
          id="address"
          defaultValue={address || data?.address}
          onChange={(e) => handleChange(e)}
        />
        {errors.address && <p className="text-red-500">{errors.address}</p>}
      </div>
      <br />
      <p>Name: {data?.name}</p>
      <p>Email: {data?.email}</p>
      <p>Address: {data?.address}</p>
      <button className="border" type="submit">
        Change Data
      </button>
    </form>
  );
};

export default ProfileForm;
