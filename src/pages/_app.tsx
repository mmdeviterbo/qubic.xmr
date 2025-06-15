import type { AppProps } from "next/app";
import Head from "next/head";
import dynamic from "next/dynamic";

import { GoogleAdsenseScript } from "@/components/analytics/GoogleAdsense";
import "@/styles/globals.css";

const HorizontalGoogleAds = dynamic(
  () => import("@/components/analytics/HorizontalGoogleAds"),
  {
    ssr: false,
  },
);

const GoogleAnalyticsScript = dynamic(
  () => import("@/components/analytics/GoogleAnalytics"),
  {
    ssr: false,
  },
);

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

      <HorizontalGoogleAds />
    </>
  );
}
