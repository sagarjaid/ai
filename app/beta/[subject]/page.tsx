import Image from "next/image";
import Link from "next/link";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";
import FloatingJoinButton from "@/components/FloatingJoinButton";
import HeroImage from "@/components/HeroImage";
// Removed deprecated single images in favor of randomized set per subject
import logoMain from "@/app/logo-main.png";
import {
  Percent,
  Heart,
  GraduationCap,
  VideoIcon,
  FanIcon,
  PyramidIcon,
} from "lucide-react";
// Base single images removed (math.png, ai.png, science.png, english.png, coding.png)
import mathReviewImage from "@/app/math-review.png";
import aiReviewImage from "@/app/ai-review.png";
import scienceReviewImage from "@/app/science-review.png";
import englishReviewImage from "@/app/english-review.png";
import codingReviewImage from "@/app/coding-review.png";
import ctaPic1 from "@/app/cta-pic-1.png";

import math1 from "@/app/math-1.png";
import math2 from "@/app/math-2.png";
import math3 from "@/app/math-3.png";
import ai1 from "@/app/ai-1.png";
import ai2 from "@/app/ai-2.png";
import ai3 from "@/app/ai-3.png";

import coding1 from "@/app/coding-1.png";
import coding2 from "@/app/coding-2.png";
import coding3 from "@/app/coding-3.png";

import english1 from "@/app/english-1.png";
import english2 from "@/app/english-2.png";
import english3 from "@/app/english-3.png";

import science1 from "@/app/sci-1.png";
import science2 from "@/app/sci-2.png";
import science3 from "@/app/sci-3.png";

// Helper: get subject-specific images array
const getSubjectImages = (subjectKey: string) => {
  const subjectToImages: Record<string, any[]> = {
    math: [math1, math2, math3],
    english: [english1, english2, english3],
    ai: [ai1, ai2, ai3],
    coding: [coding1, coding2, coding3],
    science: [science1, science2, science3],
  };
  return subjectToImages[subjectKey] || subjectToImages.math;
};

// Subject configuration
const subjectConfig: Record<
  string,
  {
    gradeRange: string;
    ageRange: string;
    title: string;
    description: string;
    highlight?: string;
    reviewImage: typeof mathReviewImage;
    reviewText: string;
    reviewAuthor: string;
  }
> = {
  math: {
    gradeRange: "Kindergarten to Grade 5",
    ageRange: "Age 3-11",
    title: "Master Math with World's First AI Tutor",
    description:
      "Learn Mathematics with AI that adapts to your child's learning style, join beta today for 100% FREE and get immediate results in less than month",
    reviewImage: mathReviewImage,
    reviewText:
      "Emma's math confidence has soared! The AI tutor makes learning fun and she's actually excited about homework now",
    reviewAuthor: "Sarah, Parent of Emma (Age 8)",
  },
  english: {
    gradeRange: "Kindergarten to Grade 5",
    ageRange: "Age 3-11",
    title: "Master English with World's First AI Tutor",
    description:
      "Learn English with AI that adapts to your child's learning style, join beta today for 100% FREE and get immediate results in less than month",
    reviewImage: englishReviewImage,
    reviewText:
      "My daughter Mia went from struggling with reading to finishing her first chapter from a book. The progress is incredible!",
    reviewAuthor: "Jennifer, Parent of Mia (Age 7)",
  },
  ai: {
    gradeRange: "Grade 3-9",
    ageRange: "Age 8-14",
    title: "Master AI with the World's First AI Tutor",
    description:
      "Learn Artificial Intelligence with AI that adapts to your child's learning style, join beta today for 100% FREE and get immediate results in less than month",
    reviewImage: aiReviewImage,
    reviewText:
      "Sameer is building his own AI projects now! The personalized approach has unlocked his creativity and problem-solving skills",
    reviewAuthor: "Rachana, Parent of Samer (Age 11)",
  },
  coding: {
    gradeRange: "Grade 1-9",
    ageRange: "Age 6-15",
    title: "Master Coding with World's First AI Tutor",
    description:
      "Learn Coding with AI that adapts to your child's learning style, join beta today for 100% FREE and get immediate results in less than month",
    highlight: "Block based - Grade 1-5, JavaScript Web dev - Grade 6-9",
    reviewImage: codingReviewImage,
    reviewText:
      "Well-structured courses have made coding fun for my son. I'm so glad I found this app",
    reviewAuthor: "Sharyn, Parent of Jake (Age 9)",
  },
  science: {
    gradeRange: "Kindergarten to Grade 5",
    ageRange: "Age 3-11",
    title: "Master Science with World's First AI Tutor",
    description:
      "Learn Science with AI that adapts to your child's learning style, join beta today for 100% FREE and get immediate results in less than month",
    reviewImage: scienceReviewImage,
    reviewText:
      "Sophia asks more questions and understands concepts deeper. The AI tutor explains everything in ways that click for her",
    reviewAuthor: "David, Parent of Sophia (Age 9)",
  },
};

interface PageProps {
  params: Promise<{ subject: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { subject } = await params;
  const subjectData =
    subjectConfig[subject.toLowerCase()] || subjectConfig.math;
  const subjectTitle = subject.charAt(0).toUpperCase() + subject.slice(1);

  return getSEOTags({
    title: `${subjectTitle} Beta Program | ${config.appName}`,
    description: subjectData.description,
    canonicalUrlRelative: `/beta/${subject}`,
  });
}

export default async function BetaSubjectPage({ params }: PageProps) {
  const { subject } = await params;
  const subjectKey = subject.toLowerCase();
  const subjectData = subjectConfig[subjectKey] || subjectConfig.math;
  const subjectTitle =
    subject === "ai"
      ? "AI"
      : subject.charAt(0).toUpperCase() + subject.slice(1);
  const subjectImages = getSubjectImages(subjectKey);

  return (
    <>
      {/* Header */}
      <header className="bg-white">
        <nav className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <Link href="/" className="relative h-10 w-36">
            <Image
              src={logoMain}
              alt="AIFORJR Logo"
              fill
              className="object-contain object-left w-full h-full"
              priority
            />
          </Link>
          <Link
            href={`/beta/${subject}?join=beta`}
            className="bg-red-600 font-nord text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Join Beta
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="bg-white">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-8 py-10 lg:py-16">
          <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Text Content - First in DOM for desktop grid (left column) */}
            <div className="flex flex-col justify-center gap-6">
              <div className="flex gap-1">
                <p className="text-gray-600 text-sm font-semibold tracking-wide">
                  {subjectData.gradeRange}
                </p>
                <p className="text-gray-600 text-xs pt-0.5 font-normal tracking-wide">
                  ({subjectData.ageRange})
                </p>
              </div>

              <h1 className="text-4xl lg:text-6xl font-nord font-bold text-gray-900 leading-tight">
                {subjectData.title}
              </h1>

              <p className="text-base font-normal text-gray-600 leading-relaxed">
                {subjectData.description}
              </p>

              <div className="flex flex-col justify-center gap-2 w-fit">
                <Link
                  href={`/beta/${subject}?join=beta`}
                  className="bg-red-600 font-nord text-white px-8 py-4 rounded-lg font-semibold text-lg w-fit hover:bg-red-700 transition-colors"
                >
                  Join Beta for 100% FREE
                </Link>

                <p className="text-xs text-center text-gray-500">
                  No credit card required, Only 3 Spots left this week
                </p>
              </div>

              {/* Trusted By Section */}
              <div className="mt-10">
                <p className="text-gray-600 text-xs mb-4">
                  Trusted by Parents from
                </p>
                <div className="flex flex-wrap items-center gap-6 opacity-60">
                  <div className="text-gray-500 font-semibold text-lg">
                    Google
                  </div>
                  <div className="text-gray-500 font-semibold text-lg">
                    Microsoft
                  </div>
                  <div className="text-gray-500 font-semibold text-lg">
                    Deloitte
                  </div>
                  <div className="text-gray-500 font-semibold text-lg">
                    Amazon
                  </div>
                  <div className="text-gray-500 font-semibold text-lg">BCG</div>
                  <div className="text-gray-500 font-semibold text-lg">
                    McKinsey
                  </div>
                </div>
              </div>
            </div>

            {/* Image - Second in DOM for desktop grid (right column), reversed on mobile to appear first */}
            <div className="w-full">
              <HeroImage images={subjectImages} />
            </div>
          </div>
        </section>

        {/* Beta Member Benefits Section */}
        <section className="max-w-7xl mx-auto px-8 py-16 lg:py-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-nord font-bold text-gray-900 mb-4">
              Beta Member Benefits
            </h2>
            <p className="text-lg text-gray-600">
              Limited Beta seats for Parents & Kids
            </p>
          </div>

          {/*  Benefits section */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-pink-50 rounded-xl p-6 py-10 hover:bg-pink-100 transition-colors">
              <PyramidIcon
                className="w-16 h-16 text-gray-900 mb-4"
                strokeWidth={1.8}
                fill="none"
                stroke="currentColor"
              />
              <h3 className="text-xl font-black text-gray-900 mb-2">
                Designed by Experts
              </h3>
              <p className="text-gray-600 text-sm">
                Learn 6-8 core modules of {subjectTitle.toLowerCase()} with AI
              </p>
            </div>
            <div className="bg-red-600 rounded-xl p-6 py-10">
              {/* <BadgeCheck */}
              <FanIcon
                className="w-16 h-16 text-white/90 mb-3"
                strokeWidth={1.6}
                fill="none"
                stroke="currentColor"
              />
              <h3 className="text-xl font-black text-white/90 mb-2">
                100% FREE
              </h3>
              <p className="text-white/90 text-sm">
                Get immediate results in less than a month
              </p>
            </div>
            <div className="bg-pink-50 rounded-xl p-6 py-10 hover:bg-pink-100 transition-colors">
              <VideoIcon
                className="w-16 h-16 text-gray-900 mb-3"
                strokeWidth={1.8}
                fill="none"
                stroke="currentColor"
              />
              <h3 className="text-xl font-black text-gray-900 mb-2">
                1:1 AI Sessions
              </h3>
              <p className="text-gray-600 text-sm">
                Master {subjectTitle.toLowerCase()} with 1:1 AI sessions with AI
                tutor
              </p>
            </div>
            <div className="bg-pink-50 rounded-xl p-6 py-10 hover:bg-pink-100 transition-colors">
              <Percent
                className="w-16 h-16 text-gray-900 mb-3"
                strokeWidth={1.8}
                fill="none"
                stroke="currentColor"
              />
              <h3 className="text-xl font-black text-gray-900 mb-2">
                Lifetime Discount
              </h3>
              <p className="text-gray-600 text-sm">
                Lock in early adopter benefits for life
              </p>
            </div>
            <div className="bg-pink-50 rounded-xl p-6 py-10 hover:bg-pink-100 transition-colors">
              {/* <BadgeCheck */}
              <GraduationCap
                className="w-16 h-16 text-gray-900 mb-3"
                strokeWidth={1.8}
                fill="none"
                stroke="currentColor"
              />
              <h3 className="text-xl font-black text-gray-900 mb-2">
                Certificate
              </h3>
              <p className="text-gray-600 text-sm">
                Earn verified learning certificates
              </p>
            </div>
            <div className="bg-pink-50 rounded-xl p-6 py-10 hover:bg-pink-100 transition-colors">
              <Heart
                className="w-16 h-16 text-gray-900 mb-3"
                strokeWidth={1.8}
                fill="none"
                stroke="currentColor"
              />
              <h3 className="text-xl font-black text-gray-900 mb-2">
                Shape the Future
              </h3>
              <p className="text-gray-600 text-sm">
                Your feedback drives features & 1:1 sessions
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-center gap-2 my-10 w-full items-center">
            <Link
              href={`/beta/${subject}?join=beta`}
              className="bg-red-600 font-nord text-white px-8 py-4 rounded-lg font-semibold text-lg w-fit hover:bg-red-700 transition-colors"
            >
              Join Beta for 100% FREE
            </Link>

            <p className="text-xs text-center text-gray-500">
              No credit card required, Only 3 Spots left this week
            </p>
          </div>
        </section>
        {/* Review Section */}

        <section className="max-w-7xl mx-auto px-8 py-16 lg:py-24  bg-gradient-to-r from-white via-pink-50 to-white">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-nord font-bold text-gray-900 mb-4">
              Listen from Themself
            </h2>
            <p className="text-lg text-gray-600">
              Approved Parents from {subjectTitle} Beta Program
            </p>
          </div>
          <div className="relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 " />

            <div className="max-w-7xl mx-auto lg:px-8 px-4 relative">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                {/* Left Side - Review Image */}
                <div className="relative">
                  <div className="relative w-full rounded-2xl overflow-hidden">
                    <Image
                      src={subjectData.reviewImage.src}
                      alt={`Review for ${subjectTitle} learning`}
                      width={800}
                      height={600}
                      className="w-full h-auto object-contain"
                    />
                  </div>
                </div>

                {/* Right Side - Testimonial */}
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
                    {subjectData.reviewText}
                  </blockquote>
                  <p className="text-sm text-gray-900 font-thin">
                    {subjectData.reviewAuthor}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Join in 3 Steps Section */}
        <section className="max-w-7xl mx-auto px-8 py-16 lg:py-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-nord font-bold text-gray-900 mb-4">
              Join with 3 Easy Steps
            </h2>
            <p className="text-lg text-gray-600">
              Join 90+ parents who are giving their kids a head start in{" "}
              {subjectTitle.toLowerCase()} learning
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-pink-50 rounded-xl p-8">
              <div className="text-6xl font-bold text-red-600 mb-4">1</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Apply</h3>
              <p className="text-gray-600">
                Tell us about your child&apos;s learning goals + 15 minutes
                screening call
              </p>
            </div>
            <div className="bg-pink-50 rounded-xl p-8">
              <div className="text-6xl font-bold text-red-600 mb-4">2</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Beta Approval
              </h3>
              <p className="text-gray-600">
                Quick approval within 24 hours & gain access to dashboard
              </p>
            </div>
            <div className="bg-pink-50 rounded-xl p-8">
              <div className="text-6xl font-bold text-red-600 mb-4">3</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Start Learning
              </h3>
              <p className="text-gray-600">
                Your Kid Begin learning {subjectTitle} with Our AI Tutor
                Immediately
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-center gap-2 my-10 w-full items-center">
            <Link
              href={`/beta/${subject}?join=beta`}
              className="bg-red-600 font-nord text-white px-8 py-4 rounded-lg font-semibold text-lg w-fit hover:bg-red-700 transition-colors"
            >
              Join Beta for 100% FREE
            </Link>

            <p className="text-xs text-center text-gray-500">
              No credit card required, Only 3 Spots left this week
            </p>
          </div>
        </section>

        {/* Bottom CTA Section - 50/50 Image + Content */}
        <section className="max-w-6xl mx-auto  px-8 py-16 pb-40 lg:pb-40 lg:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden shadow-lg">
            {/* Left: Image */}
            <div className="relative min-h-[300px] md:min-h-[420px]">
              <Image
                src={ctaPic1.src}
                alt="Parent helping child learn"
                fill
                className="object-cover"
                priority
              />
            </div>
            {/* Right: CTA Content */}
            <div className="bg-red-600 md:p-24 p-10 text-center flex flex-col justify-center">
              <h2 className="text-3xl lg:text-4xl font-nord font-bold text-white/90 mb-4">
                Make Your Kids {subjectTitle} Ready Today!
              </h2>
              <p className="text-lg text-white/90 mb-8">
                Unlock free access to world-class {subjectTitle.toLowerCase()}{" "}
                tutoring powered by AI
              </p>
              <Link
                href={`/beta/${subject}?join=beta`}
                className="bg-white font-nord text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg inline-block hover:bg-white/90 transition-colors"
              >
                Join FREE Beta Access
              </Link>
              <p className="text-xs text-white/60 mt-4">
                No credit card required, Only 3 Spots left this week
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="">
        <div className="max-w-7xl mx-auto px-8 -mt-20 pb-40">
          <div className="flex flex-col justify-center items-center mb-4 gap-3">
            <div className="relative h-10 w-36">
              <Image
                src={logoMain}
                alt="AIFORJR Logo"
                fill
                className="object-contain object-left w-full h-full"
              />
            </div>
            <p className="text-gray-600 text-sm">
              Enabling a Next Generation of Learners
            </p>
          </div>
          <div className="flex justify-center gap-2">
            <Link
              href="/privacy-policy"
              className="text-gray-600 hover:text-gray-900 text-xs"
            >
              Privacy Policy
            </Link>
            <Link
              href="/tos"
              className="text-gray-600 hover:text-gray-900 text-xs"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>

      {/* Floating Join Button */}
      <FloatingJoinButton />
    </>
  );
}
