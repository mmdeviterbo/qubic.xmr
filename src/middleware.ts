import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (process.env.NODE_ENV !== "production") {
    return NextResponse.next();
  }

  // let referer = request.headers.get("referer"); // Full client page URL
  // if (referer?.endsWith("/")) {
  //   referer = referer.slice(0, referer.length - 1);
  // }

  // const allowedBaseUrl = process.env.BASE_URL;
  // if (!referer || !referer?.includes(allowedBaseUrl)) {
  //   return NextResponse.json({});
  // }

  return NextResponse.next();
}
