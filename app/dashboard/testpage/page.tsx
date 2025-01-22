"use client";
import React from "react";

const page = () => {
  const handleClick = async () => {
    const res = await fetch("/api/sendMail", {
      method: "POST",
    });
    console.log(res);
  };

  return (
    <div>
      <button onClick={handleClick} className="border p-2 rounded-xl m-20">
        send email
      </button>
    </div>
  );
};

export default page;
