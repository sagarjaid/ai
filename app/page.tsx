import Image from "next/image";
import Link from "next/link";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";
import heroImage from "@/app/coding.png";
import logoMain from "@/app/logo-main.png";
import logoLight from "@/app/logo-light.png";

export const metadata = getSEOTags({
  title: `${config.appName} - AI Tutor for Kids`,
  description:
    "World's first AI Tutor for kids that is tailored to your child's learning style and pace. First Month is Free!",
  canonicalUrlRelative: "/",
});

export default function Home() {
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
            href="/join"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-red-600 font-nord text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Join Beta
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="bg-white">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column */}

            <div className="aspect-[4/3] block md:hidden relative">
              <Image
                src={heroImage.src}
                alt="Child using laptop with AI tutor"
                fill
                className="object-cover"
                priority
              />
            </div>

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
              <Link
                href="/join"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-600 font-nord text-white px-8 py-4 rounded-lg font-semibold text-lg w-fit hover:bg-red-700 transition-colors"
              >
                Join Beta for 100% FREE
              </Link>

              {/* <div className="mt-10">
                <p className="text-gray-600 text-xs mb-4">
                  Trusted by Parents from
                </p>
                <div className="flex flex-wrap items-center gap-6 opacity-60">
                  <div className="text-gray-500 font-semibold text-lg">
                    Coding
                  </div>
                  <div className="text-gray-500 font-semibold text-lg">•</div>

                  <div className="text-gray-500 font-semibold text-lg">AI</div>
                  <div className="text-gray-500 font-semibold text-lg">•</div>
                  <div className="text-gray-500 font-semibold text-lg">
                    Math
                  </div>
                  <div className="text-gray-500 font-semibold text-lg">•</div>
                  <div className="text-gray-500 font-semibold text-lg">
                    English
                  </div>
                </div>
              </div> */}

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

            {/* Right Column - Image with Overlays */}
            <div className="relative hidden md:block">
              {/* Main Image */}
              <div className="aspect-[4/3]  relative">
                <Image
                  src={heroImage.src}
                  alt="Child using laptop with AI tutor"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-red-600 text-white">
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
                <Link
                  href="/join"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/90 hover:text-white text-sm"
                >
                  Join Beta
                </Link>
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
    </>
  );
}
