"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { PropsWithChildren } from "react";

interface JoinBetaLinkProps {
  className?: string;
}

export default function JoinBetaLink({
  className,
  children,
}: PropsWithChildren<JoinBetaLinkProps>) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const params = new URLSearchParams(searchParams?.toString() || "");
  params.set("join", "beta");
  const href = `${pathname}?${params.toString()}`;

  return (
    <Link href={href} className={className} scroll={false}>
      {children}
    </Link>
  );
}
