"use client";
import { useState, useEffect } from "react";
import { getThemeLocalStorage } from "@/lib/utils";
import { setThemeLocalStorage } from "@/lib/utils";
import { MdDarkMode } from "react-icons/md";
import { MdOutlineDarkMode } from "react-icons/md";

const ThemeButton = () => {
  const [theme, setTheme] = useState("light");

  const handleThemeToggle = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    setThemeLocalStorage(newTheme);
  };

  useEffect(() => {
    const storedTheme = getThemeLocalStorage();
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.setAttribute("data-theme", storedTheme);
      document.documentElement.classList.toggle("dark", storedTheme === "dark");
    } else {
      setTheme("light");
      document.documentElement.setAttribute("data-theme", "light");
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <button
      onClick={handleThemeToggle}
      className="btn border-2 border-gray-300 dark:border-gray-700 p-2 rounded-lg"
    >
      <p aria-label="Toggle theme">
        {theme === "light" ? <MdDarkMode /> : <MdOutlineDarkMode />}
      </p>
    </button>
  );
};

export default ThemeButton;
