import type { AppProps } from "next/app";
import Head from "next/head";
import Script from "next/script";

import { GoogleAdsenseScript } from "@/components/analytics/GoogleAdsense";
import "@/styles/globals.css";
import { GoogleAnalyticsScript } from "@/components/analytics/GoogleAnalytics";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Qubic Custom Mining</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <GoogleAdsenseScript />
      <GoogleAnalyticsScript />

      <Component {...pageProps} />
      {/* <Analytics /> */}
    </>
  );
}
