"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface HeroImageProps {
  images: any[];
}

export default function HeroImage({ images }: HeroImageProps) {
  // Use useState with lazy initializer to only run on client
  const [randomImage, setRandomImage] = useState<any>(null);

  useEffect(() => {
    // Only select random image on client side to avoid hydration mismatch
    if (!randomImage) {
      setRandomImage(images[Math.floor(Math.random() * images.length)]);
    }
  }, [images, randomImage]);

  // Show nothing or a placeholder during SSR and initial client render
  if (!randomImage) {
    return null;
  }

  return (
    <>
      {/* Mobile Image - shown first on mobile, above content */}
      <div className="aspect-[4/3] block lg:hidden relative">
        <Image
          src={randomImage}
          alt="Child using laptop with AI tutor"
          fill
          className="object-cover"
          priority
          suppressHydrationWarning
        />
      </div>

      {/* Desktop Image - shown in right column on desktop */}
      <div className="relative hidden lg:block">
        <div className="aspect-[4/3] relative">
          <Image
            src={randomImage}
            alt="Child using laptop with AI tutor"
            fill
            className="object-cover"
            priority
            suppressHydrationWarning
          />
        </div>
      </div>
    </>
  );
}
