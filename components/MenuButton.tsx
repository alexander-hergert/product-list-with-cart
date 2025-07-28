"use client";
import React from "react";
import { FiMenu } from "react-icons/fi";
import { useContext } from "react";
import { MenuContext } from "@/lib/menuContext";

const MenuButton = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error("MenuButton must be used within a MenuProvider");
  }
  const { setIsMenuOpen } = context;

  const handleToggleMenu = () => {
    setIsMenuOpen((prev: boolean) => !prev);
  };

  return (
    <button
      onClick={handleToggleMenu}
      className="btn btn-ghost text-2xl"
    >
      <FiMenu />
    </button>
  );
};

export default MenuButton;
