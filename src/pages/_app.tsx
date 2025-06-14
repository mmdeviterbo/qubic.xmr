import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import Script from "next/script";
// import { Analytics } from "@vercel/analytics/next";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Qubic Custom Mining</title>
        <link rel="icon" href="/favicon.ico" />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1941263261411851"
          crossOrigin="anonymous"
        />
      </Head>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=G-NL226L3VBQ`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-NL226L3VBQ', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      <Component {...pageProps} />
      {/* <Analytics /> */}
    </>
  );
}
