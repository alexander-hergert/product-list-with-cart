"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

const images = [
  {
    src: "/images/breakfast/image-blueberry-pancake-desktop.jpeg",
    alt: "Blueberry pancakes",
  },
  {
    src: "/images/desserts/image-apple-pie-desktop.jpeg",
    alt: "Apple pie",
  },
  {
    src: "/images/lunch/image-caesar-salad-desktop.jpeg",
    alt: "Caesar salad",
  },
];

function AnimatedImageContainer() {
  const [imageNumber, setImageNumber] = useState(0);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setImageNumber((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, [imageNumber]);

  return (
    <section>
      {images.map((img, i) =>
        i === imageNumber ? (
          <Image
            data-testid="animated-image"
            key={img.src}
            className="rounded-lg animate-fadeIn"
            src={img.src}
            width={400}
            height={400}
            alt={img.alt}
          />
        ) : null
      )}
    </section>
  );
}

export default AnimatedImageContainer;
