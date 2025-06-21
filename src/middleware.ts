import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host");

  // Replace with your actual custom domain
  if (host?.includes("vercel.app")) {
    const customDomain = "https://www.qubic-xmr.live";
    return NextResponse.redirect(customDomain, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.png).*)"],
};
