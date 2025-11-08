import Image from "next/image";
import Link from "next/link";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";
import logoMain from "@/app/logo-main.png";
import logoLight from "@/app/logo-light.png";
import math1 from "@/app/math-1.png";
import math2 from "@/app/math-2.png";
import math3 from "@/app/math-3.png";

import ai1 from "@/app/ai-1.png";
import ai2 from "@/app/ai-2.png";
import ai3 from "@/app/ai-3.png";

import coding1 from "@/app/coding-1.png";
import coding2 from "@/app/coding-1.png";
import coding3 from "@/app/coding-3.png";

import english1 from "@/app/english-1.png";
import english2 from "@/app/english-2.png";
import english3 from "@/app/english-3.png";

import science1 from "@/app/sci-1.png";
import science2 from "@/app/sci-2.png";
import science3 from "@/app/sci-3.png";
import FloatingJoinButton from "@/components/FloatingJoinButton";
import HeroImage from "@/components/HeroImage";
import JoinBetaLink from "@/components/JoinBetaLink";
import SubjectReviewSection from "@/components/SubjectReviewSection";
import {
  Percent,
  Heart,
  GraduationCap,
  VideoIcon,
  FanIcon,
  PyramidIcon,
} from "lucide-react";
import ctaPic1 from "@/app/cta-pic-1.png";

export const metadata = getSEOTags({
  title: `${config.appName} - AI Tutor for Kids`,
  description:
    "World's first AI Tutor for kids that is tailored to your child's learning style and pace. First Month is Free!",
  canonicalUrlRelative: "/",
});

export const dynamic = "force-dynamic";

export default function Home() {
  const heroImages = [
    math1,
    math2,
    math3,

    ai1,
    ai2,
    ai3,

    coding1,
    coding2,
    coding3,

    english1,
    english2,
    english3,

    science1,
    science2,
    science3,
  ];

  return (
    <div className="min-h-screen flex flex-col">
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
          <JoinBetaLink className="bg-red-600 font-nord text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors">
            Join Beta
          </JoinBetaLink>
        </nav>
      </header>

      {/* Main Content */}
      <main className="bg-white flex-grow">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-8 py-10 lg:py-16">
          <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Text Content - First in DOM for desktop grid (left column) */}
            <div className="flex flex-col gap-6">
              <p className="text-gray-600 text-sm hidden md:block font-normal tracking-wide">
                Grow Beyond the Classroom
              </p>

              <h1 className="text-4xl lg:text-6xl font-nord font-bold text-gray-900 leading-tight">
                The AI Tutor That Kids Love
              </h1>

              <p className="text-base font-normal text-gray-600 leading-relaxed">
                Learn Coding, AI, Math, English and Science with the world&#39;s
                first AI Tutor that is tailored to your child&#39;s learning
                style and pace. First Month is Free!
              </p>
              <JoinBetaLink className="bg-red-600 font-nord text-white px-8 py-4 rounded-lg font-semibold text-lg w-fit hover:bg-red-700 transition-colors">
                Join Beta for 100% FREE
              </JoinBetaLink>

              {/* Trusted By Section */}
              <div className="mt-10">
                <p className="text-gray-600 text-xs mb-4">
                  Trusted by Parents from
                </p>
                <div className="flex flex-wrap items-center gap-6 opacity-60">
                  {/* Company Logos - using text placeholders */}
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
              <HeroImage images={heroImages} />
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
            <div className="bg-pink-100  rounded-xl p-6 py-10 hover:bg-pink-200 cursor-pointer shadow transition-colors">
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
                Learn 6-8 core modules with AI
              </p>
            </div>
            <div className="bg-red-600 shadow cursor-pointer rounded-xl p-6 py-10">
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
            <div className="bg-pink-100  rounded-xl p-6 py-10 hover:bg-pink-200 cursor-pointer shadow transition-colors">
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
                Master Subjects with 1:1 AI sessions with AI tutor
              </p>
            </div>
            <div className="bg-pink-100  rounded-xl p-6 py-10 hover:bg-pink-200 cursor-pointer shadow transition-colors">
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
            <div className="bg-pink-100  rounded-xl p-6 py-10 hover:bg-pink-200 cursor-pointer shadow transition-colors">
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
            <div className="bg-pink-100  rounded-xl p-6 py-10 hover:bg-pink-200 cursor-pointer shadow transition-colors">
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
            <JoinBetaLink className="bg-red-600 font-nord text-white px-8 py-4 rounded-lg font-semibold text-lg w-fit hover:bg-red-700 transition-colors">
              Join Beta for 100% FREE
            </JoinBetaLink>

            <p className="text-xs text-center text-gray-500">
              No credit card required, Only 3 Spots left this week
            </p>
          </div>
        </section>
        <SubjectReviewSection />

        {/* Join in 3 Steps Section */}
        <section className="max-w-7xl mx-auto px-8 py-16 lg:py-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-nord font-bold text-gray-900 mb-4">
              Join with 3 Easy Steps
            </h2>
            <p className="text-lg text-gray-600">
              Join 90+ parents who are giving their kids a head start in future
              skills like Coding, AI, Math, English and Science
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-pink-100 hover:bg-pink-200 cursor-pointer shadow rounded-xl p-8">
              <div className="text-6xl font-bold text-red-600 mb-4">1</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Apply</h3>
              <p className="text-gray-600">
                Tell us about your child&apos;s learning goals + 15 minutes
                screening call
              </p>
            </div>
            <div className="bg-pink-100 hover:bg-pink-200 cursor-pointer shadow rounded-xl p-8">
              <div className="text-6xl font-bold text-red-600 mb-4">2</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Beta Approval
              </h3>
              <p className="text-gray-600">
                Quick approval within 24 hours & gain access to dashboard
              </p>
            </div>
            <div className="bg-pink-100 hover:bg-pink-200 cursor-pointer shadow rounded-xl p-8">
              <div className="text-6xl font-bold text-red-600 mb-4">3</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Start Learning
              </h3>
              <p className="text-gray-600">
                Your Kid Begins Learning with Our AI Tutor Immediately
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-center gap-2 my-10 w-full items-center">
            <JoinBetaLink className="bg-red-600 font-nord text-white px-8 py-4 rounded-lg font-semibold text-lg w-fit hover:bg-red-700 transition-colors">
              Join Beta for 100% FREE
            </JoinBetaLink>

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
                Make Your Kids Future Ready Today!
              </h2>
              <p className="text-lg text-white/90 mb-8">
                Unlock free access to world-class personalized tutoring powered
                by AI
              </p>
              <JoinBetaLink className="bg-white font-nord text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg inline-block hover:bg-white/90 transition-colors">
                Join FREE Beta Access
              </JoinBetaLink>
              <p className="text-xs text-white/60 mt-4">
                No credit card required, Only 3 Spots left this week
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-red-600 text-white mt-auto">
        <div className="max-w-7xl mx-auto px-8 pt-20 pb-40">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Section - Logo and Tagline */}
            <div className="flex flex-col gap-3">
              <div className="relative h-10 w-36">
                <Image
                  src={logoLight}
                  alt="AIFORJR Logo"
                  fill
                  className="object-contain object-left w-full h-full"
                />
              </div>
              <p className="text-white/90 text-sm">
                Enabling a Next Generation of Learners
              </p>
            </div>

            {/* Right Section - Important Links Socials and Legal */}
            <div className="flex md:flex-row flex-col md:gap-20 gap-10">
              <div>
                <div className="font-bold font-nord text-sm uppercase tracking-wider mb-3">
                  Important Links
                </div>
                <JoinBetaLink className="text-white/90 hover:text-white text-sm">
                  Join Beta
                </JoinBetaLink>
              </div>

              <div>
                <div className="font-bold font-nord text-sm uppercase tracking-wider mb-3">
                  Socials
                </div>
                <div className="flex flex-col gap-2">
                  <Link
                    href="https://www.linkedin.com/in/sagarjaid/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/90 hover:text-white text-sm"
                  >
                    LinkedIn
                  </Link>
                  <Link
                    href="https://www.linkedin.com/in/sagarjaid/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/90 hover:text-white text-sm"
                  >
                    Twitter
                  </Link>
                  <Link
                    href="https://www.linkedin.com/in/sagarjaid/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/90 hover:text-white text-sm"
                  >
                    Instagram
                  </Link>
                </div>
              </div>

              <div>
                <div className="font-bold font-nord text-sm uppercase tracking-wider mb-3">
                  Legal
                </div>
                <div className="flex flex-col gap-2">
                  <Link
                    href="/privacy-policy"
                    className="text-white/90 hover:text-white text-sm"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    href="/tos"
                    className="text-white/90 hover:text-white text-sm"
                  >
                    Terms of Service
                  </Link>
                  {/* <Link
                    href="/#"
                    className="text-white/90 hover:text-white text-sm"
                  >
                    Refund Policy
                  </Link> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
      {/* Floating Join Button */}
      <FloatingJoinButton />
    </div>
  );
}
