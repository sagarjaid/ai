import { ReactNode } from "react";
import localFont from "next/font/local";
import { Viewport } from "next";
import { getSEOTags } from "@/libs/seo";
import ClientLayout from "@/components/LayoutClient";
import config from "@/config";
import "./globals.css";

// Main font - ABCGintoNormalVariable (applied to entire website)
const fontMain = localFont({
  src: "../fonts/ABCGintoNormalVariable-Trial-BF651b7b7af3067.ttf",
  variable: "--font-main",
  display: "swap",
});

// Secondary font - ABCGintoNordVariable (available as Tailwind class)
const fontNord = localFont({
  src: "../fonts/ABCGintoNordVariable-Trial-BF651b7b7b56298.ttf",
  variable: "--font-nord",
  display: "swap",
});

export const viewport: Viewport = {
  // Will use the primary color of your theme to show a nice theme color in the URL bar of supported browsers
  themeColor: config.colors.main,
  width: "device-width",
  initialScale: 1,
};

// This adds default SEO tags to all pages in our app.
// You can override them in each page passing params to getSOTags() function.
export const metadata = getSEOTags({
  title: "AIFORJR - AI Tutor for Kids",
  description:
    "World's first AI Tutor for kids that is tailored to your child's learning style and pace. First Month is Free!",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      data-theme={config.colors.theme}
      className={`${fontMain.variable} ${fontNord.variable}`}
    >
      <body suppressHydrationWarning>
        {/* ClientLayout contains all the client wrappers (Crisp chat support, toast messages, tooltips, etc.) */}
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
