import "@/styles/globals.css";
import type { AppProps } from "next/app";
// import { Analytics } from "@vercel/analytics/next";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      {/* <Analytics /> */}
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1941263261411851" crossOrigin="anonymous" />
    </>
  );
}
