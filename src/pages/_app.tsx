import type { AppProps } from "next/app";
import Head from "next/head";
import dynamic from "next/dynamic";
import { SeoMeta } from "@/components/analytics/Seo";
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
        <SeoMeta />
      </Head>

      <GoogleAnalyticsScript />

      <Component {...pageProps} />
    </>
  );
}
