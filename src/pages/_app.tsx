import type { AppProps } from "next/app";
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
      <GoogleAnalyticsScript />

      <Component {...pageProps} />
    </>
  );
}
