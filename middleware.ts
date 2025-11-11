import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/libs/supabase/middleware";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/join") {
    return NextResponse.redirect(
      "https://aiforjr.com/?join=beta",
      308
    );
  }

  // Redirect exact /beta to /join
  if (request.nextUrl.pathname === "/beta") {
    return NextResponse.redirect(new URL("/join", request.url));
  }

  // A/B image variant bucketing for beta subject pages
  // Path: /beta/[subject]
  const betaSubjectMatch = request.nextUrl.pathname.match(/^\/beta\/([^/]+)$/);
  if (betaSubjectMatch) {
    const url = request.nextUrl.clone();
    const params = url.searchParams;

    // If URL already specifies an img variant, respect it
    if (!params.has("img")) {
      const subject = betaSubjectMatch[1].toLowerCase();
      const cookieName = `img_variant_${subject}`;
      let variant = request.cookies.get(cookieName)?.value;

      if (!variant) {
        // Assign random 1..3 for three images
        const random = Math.floor(Math.random() * 3) + 1;
        variant = String(random);
      }

      // Set the param and persist cookie for consistency across visits
      params.set("img", variant);
      url.search = params.toString();

      const response = NextResponse.rewrite(url);
      response.cookies.set(cookieName, variant, {
        path: "/",
        httpOnly: false,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
      return response;
    }
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
