"use client";

import { useState, useEffect, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import BetaWaitlistForm from "@/components/BetaWaitlistForm";

export default function FloatingJoinButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const isUpdatingUrlRef = useRef(false);

  // Extract subject from pathname if on beta subject page
  const getSubjectFromPath = () => {
    const match = pathname.match(/^\/beta\/([^/]+)/);
    return match ? match[1].toLowerCase() : null;
  };

  const preselectedSubject = getSubjectFromPath();

  // Track scroll position to show/hide button (except on homepage)
  useEffect(() => {
    // Always show on homepage
    if (pathname === "/") {
      setIsScrolled(true);
      return;
    }

    const handleScroll = () => {
      // Show button when user has scrolled more than 100px
      setIsScrolled(window.scrollY > 100);
    };

    // Check initial scroll position
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  // Check URL parameter on mount and when searchParams change (only if not programmatically updating)
  useEffect(() => {
    // Skip if we're programmatically updating the URL
    if (isUpdatingUrlRef.current) {
      return;
    }

    const joinParam = searchParams.get("join");
    const shouldBeOpen = joinParam === "beta" || joinParam === "true";

    // Sync state from URL
    if (shouldBeOpen && !isModalOpen) {
      // Prevent scroll to top when opening modal from URL
      const scrollY = window.scrollY;
      setIsModalOpen(true);
      // Restore scroll position after a brief delay
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollY);
      });
    } else {
      setIsModalOpen(shouldBeOpen);
    }
  }, [searchParams, isModalOpen]);

  const handleOpen = () => {
    // Save scroll position
    const scrollY = window.scrollY;
    setIsModalOpen(true);
    // Update URL without adding to history
    isUpdatingUrlRef.current = true;
    const params = new URLSearchParams(searchParams.toString());
    params.set("join", "beta");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    // Restore scroll position after URL update
    requestAnimationFrame(() => {
      window.scrollTo(0, scrollY);
    });
    // Reset the flag after a short delay to allow router to update
    setTimeout(() => {
      isUpdatingUrlRef.current = false;
    }, 100);
  };

  const handleClose = () => {
    // Prevent multiple rapid calls
    if (!isModalOpen) return;

    // Save scroll position
    const scrollY = window.scrollY;
    setIsModalOpen(false);
    // Remove join parameter from URL
    isUpdatingUrlRef.current = true;
    const params = new URLSearchParams(searchParams.toString());
    params.delete("join");
    const newUrl = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;
    router.replace(newUrl, { scroll: false });
    // Restore scroll position after URL update
    requestAnimationFrame(() => {
      window.scrollTo(0, scrollY);
    });
    // Reset the flag after a short delay to allow router to update
    setTimeout(() => {
      isUpdatingUrlRef.current = false;
    }, 100);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={handleOpen}
        className={`fixed bottom-6 right-6 z-40 cursor-pointer bg-red-600 text-white px-6 py-4 rounded-full shadow-lg hover:bg-red-700 transition-all duration-300 font-nord font-semibold text-base md:text-lg flex items-center gap-2 hover:scale-105 active:scale-95 ${
          isScrolled || isModalOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        aria-label="Join Beta Waitlist"
      >
        {/* <span className="hidden sm:inline">Join Beta</span> */}
        {/* <span className="sm:hidden">Join</span> */}
        <span>Join Beta</span>
      </button>

      {/* Slide-in Panel */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={handleClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            {/* Blurred backdrop */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
              aria-hidden="true"
            />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="flex h-full justify-end">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-200"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="relative w-full max-w-lg md:max-w-xl h-full bg-white shadow-xl flex flex-col">
                  {/* Form Content */}
                  <div className="flex-1 overflow-y-auto min-h-0">
                    <BetaWaitlistForm
                      onClose={handleClose}
                      preselectedSubject={preselectedSubject}
                    />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
