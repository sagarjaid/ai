"use client";

import { useEffect, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { useSearchParams } from "next/navigation";

import mathReviewImage from "@/app/math-review.png";
import aiReviewImage from "@/app/ai-review.png";
import scienceReviewImage from "@/app/science-review.png";
import englishReviewImage from "@/app/english-review.png";
import codingReviewImage from "@/app/coding-review.png";

type SubjectReviewConfig = Record<
  string,
  {
    reviewImage: StaticImageData;
    reviewText: string;
    reviewAuthor: string;
  }
>;

const subjectReviewConfig: SubjectReviewConfig = {
  math: {
    reviewImage: mathReviewImage,
    reviewText:
      "Emma's math confidence has soared! The AI tutor makes learning fun and she's actually excited about homework now",
    reviewAuthor: "Sarah, Parent of Emma (Age 8)",
  },
  english: {
    reviewImage: englishReviewImage,
    reviewText:
      "My daughter Mia went from struggling with reading to finishing her first chapter from a book. The progress is incredible!",
    reviewAuthor: "Jennifer, Parent of Mia (Age 7)",
  },
  ai: {
    reviewImage: aiReviewImage,
    reviewText:
      "Sameer is building his own AI projects now! The personalized approach has unlocked his creativity and problem-solving skills",
    reviewAuthor: "Rachana, Parent of Samer (Age 11)",
  },
  coding: {
    reviewImage: codingReviewImage,
    reviewText:
      "Well-structured courses have made coding fun for my son. I'm so glad I found this app",
    reviewAuthor: "Sharyn, Parent of Jake (Age 9)",
  },
  science: {
    reviewImage: scienceReviewImage,
    reviewText:
      "Sophia asks more questions and understands concepts deeper. The AI tutor explains everything in ways that click for her",
    reviewAuthor: "David, Parent of Sophia (Age 9)",
  },
};

type SubjectKey = keyof typeof subjectReviewConfig;

const subjects: SubjectKey[] = Object.keys(subjectReviewConfig) as SubjectKey[];

const isSubjectKey = (value: string): value is SubjectKey =>
  value in subjectReviewConfig;

export default function SubjectReviewSection() {
  const searchParams = useSearchParams();
  const [selectedSubject, setSelectedSubject] = useState<SubjectKey | null>(
    null
  );

  useEffect(() => {
    if (selectedSubject) return;

    const subjectParam = searchParams?.get("subject");
    let subjectToUse: SubjectKey | null = null;

    if (subjectParam && isSubjectKey(subjectParam)) {
      subjectToUse = subjectParam;
    }

    if (!subjectToUse) {
      subjectToUse = subjects[Math.floor(Math.random() * subjects.length)];
    }

    setSelectedSubject(subjectToUse);
  }, [searchParams, selectedSubject]);

  if (!selectedSubject) {
    return null;
  }

  const review = subjectReviewConfig[selectedSubject];

  return (
    <section className="max-w-7xl mx-auto px-8 py-16 lg:py-24  bg-gradient-to-r from-white via-pink-100 to-white">
      <div className="text-center mb-12">
        <h2 className="text-4xl lg:text-5xl font-nord font-bold text-gray-900 mb-4">
          Listen from Themself
        </h2>
        <p className="text-lg text-gray-600">
          Approved Parents from Beta Program
        </p>
      </div>
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 " />

        <div className="max-w-7xl mx-auto lg:px-8 px-4 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="relative">
              <div className="relative w-full rounded-2xl overflow-hidden">
                <Image
                  src={review.reviewImage}
                  alt={`Parent review for ${selectedSubject} subject`}
                  width={800}
                  height={600}
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 lg:p-12">
              <svg
                viewBox="0 0 42 39"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-10"
              >
                <path
                  d="M41.5451 6.31983C35.7742 8.61886 32.8622 13.8439 32.8093 21.9951H40.2744V38.3757H24.9471V25.522C24.9471 21.8122 25.1589 18.5988 25.5824 15.8817C26.0589 13.1124 27.2502 10.3693 29.1562 7.65222C31.0621 4.88293 34.0005 2.61002 37.9714 0.833496L41.5451 6.31983ZM16.8466 6.31983C11.0757 8.61886 8.13733 13.8439 8.03144 21.9951H15.576V38.3757H0.248657V25.522C0.248657 21.8122 0.460434 18.5988 0.883987 15.8817C1.36048 13.1124 2.52525 10.3693 4.3783 7.65222C6.28429 4.88293 9.24916 2.61002 13.2729 0.833496L16.8466 6.31983Z"
                  fill="#FFE2DF"
                ></path>
              </svg>

              <blockquote className="text-2xl lg:text-3xl font-bold text-gray-900 leading-relaxed mt-2 mb-6">
                {review.reviewText}
              </blockquote>
              <p className="text-sm text-gray-900 font-thin">
                {review.reviewAuthor}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
