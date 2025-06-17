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
  // useEffect(() => {
  //   const script = document.createElement("script");
  //   script.type = "text/javascript";
  //   script.src =
  //     "//pl26938302.profitableratecpm.com/d2/8e/cd/d28ecdfe9f9893a80a349176fdffd646.js"; // paste the src from Adsterra code
  //   script.async = true;
  //   document.body.appendChild(script);
  //   return () => {
  //     document.body.removeChild(script);
  //   };
  // }, []);

  return (
    <>
      <Head>
        <title>Qubic Custom Mining</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <GoogleAnalyticsScript />

      <Component {...pageProps} />
    </>
  );
}
