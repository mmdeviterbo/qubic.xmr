import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host");
  const url = request.nextUrl.clone();

  // Replace with your actual custom domain
  const customDomain = "https://www.qubic-xmr.live";

  if (host && host.includes("vercel.app")) {
    // Redirect to the same path but on the custom domain
    url.hostname = customDomain;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
