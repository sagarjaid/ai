import Link from "next/link";
import Script from "next/script";
import Image from "next/image";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";
import logoMain from "@/app/logo-main.svg";
import JoinFrame from "@/components/JoinFrame";

export const metadata = getSEOTags({
  title: `Join Waitlist | ${config.appName}`,
  description:
    "World's first AI Tutor for kids that is tailored to your child's learning style and pace. First Month is Free!",
  canonicalUrlRelative: "/join",
});

export default async function Page() {
  return (
    <>
      <Script
        src="https://tally.so/widgets/embed.js"
        strategy="afterInteractive"
      />
      <div className="w-screen h-[100dvh]">
        <header className="bg-white">
          <nav className="max-w-3xl mx-auto px-8 py-6 flex items-center justify-between">
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
              href="/"
              target="_self"
              rel="noopener noreferrer nofollow"
              className="bg-red-600 font-nord text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              Back to Home
            </Link>
          </nav>
        </header>
        <JoinFrame className="w-full h-full" />
      </div>
    </>
  );
}
