import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const baseUrl = process.env.BASE_URL;

  console.log(baseUrl);

  const host = request.headers.get('host') || ''
  if (host.endsWith('.vercel.app')) {
    const url = request.nextUrl.clone()
    url.hostname = "https://qubic-xmr.live";
    return NextResponse.redirect(url, 301)
  }
  return NextResponse.next()
}