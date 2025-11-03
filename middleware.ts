import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/libs/supabase/middleware";

export async function middleware(request: NextRequest) {
  // Redirect exact /beta to /join
  if (request.nextUrl.pathname === "/beta") {
    return NextResponse.redirect(new URL("/join", request.url));
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.png (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
