"use client";

import { useState, useCallback } from "react";

interface JoinFrameProps {
  className?: string;
}

export default function JoinFrame({ className }: JoinFrameProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className={className}>
      {!isLoaded && (
        <div className="w-full h-full flex flex-col items-center gap-4 justify-center">
          <span className="loading loading-spinner loading-xl text-red-600" />{" "}
          <span className="text-gray-600 text-sm font-nord font-medium">
            Loading...
          </span>
        </div>
      )}
      <iframe
        src="https://tally.so/r/wkDpKe?transparentBackground=1&formEventsForwarding=1"
        width="100%"
        height="100%"
        className={`w-full h-full ${isLoaded ? "" : "hidden"}`}
        title="Join Waitlist"
        onLoad={handleLoad}
      />
    </div>
  );
}
