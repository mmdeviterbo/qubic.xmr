import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
// import { Analytics } from "@vercel/analytics/next";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Qubic Custom Mining</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
      {/* <Analytics /> */}
    </>
  );
}
