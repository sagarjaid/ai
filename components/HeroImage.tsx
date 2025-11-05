"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

interface HeroImageProps {
  images: any[];
}

export default function HeroImage({ images }: HeroImageProps) {
  const searchParams = useSearchParams();
  const [selectedImage, setSelectedImage] = useState<any>(null);

  useEffect(() => {
    if (selectedImage) return;

    const imgParam = searchParams?.get("img");
    let imageToUse = null as any;

    if (imgParam) {
      const idx = Number.parseInt(imgParam, 10);
      if (!Number.isNaN(idx)) {
        // support 1-based and 0-based indices safely
        const zeroBased = idx >= 1 ? idx - 1 : idx;
        if (zeroBased >= 0 && zeroBased < images.length) {
          imageToUse = images[zeroBased];
        }
      }
    }

    if (!imageToUse) {
      imageToUse = images[Math.floor(Math.random() * images.length)];
    }

    setSelectedImage(imageToUse);
  }, [images, searchParams, selectedImage]);

  if (!selectedImage) return null;

  return (
    <>
      {/* Mobile Image - shown first on mobile, above content */}
      <div className="aspect-[4/3] block lg:hidden relative">
        <Image
          src={selectedImage}
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
            src={selectedImage}
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
