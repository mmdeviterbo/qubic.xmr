import { useEffect } from "react";
import type { AppProps } from "next/app";
import Head from "next/head";
import dynamic from "next/dynamic";

import "@/styles/globals.css";

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
        <link rel="icon" type="image/png" href="/favicon.png" sizes="48x48" />
        <link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32" />
        <link rel="icon" type="image/png" href="/favicon-16x16.png" sizes="16x16" />
      </Head>

      <GoogleAnalyticsScript />

      <Component {...pageProps} />
    </>
  );
}
