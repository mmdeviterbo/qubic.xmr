import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import "@/styles/globals.css";
import Head from "next/head";

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
        <title>Qubic Monero PoC</title>
        <link rel="icon" type="image/png" href="/favicon.png" sizes="48x48" />
        <link
          rel="icon"
          type="image/png"
          href="/favicon-32x32.png"
          sizes="32x32"
        />
        <link
          rel="icon"
          type="image/png"
          href="/favicon-16x16.png"
          sizes="16x16"
        />

        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow" />
        <meta
          name="description "
          content={
            "Qubic Custom Mining (PoC) is the first in history to execute Useful Proof of Work (UPoW). This dashboard is powered by $CFB on cfbtoken.com, a first memecoin on Qubic. UI made by Marty de Viterbo."
          }
        />
      </Head>

      <GoogleAnalyticsScript />

      <Component {...pageProps} />
    </>
  );
}
