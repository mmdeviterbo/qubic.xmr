import { type FC } from "react";
import Script from "next/script";

export const GoogleAdsenseScript: FC = () => {
  return (
    <>
      <Script
        strategy="afterInteractive"
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1941263261411851"
        crossOrigin="anonymous"
      />
    </>
  );
};

export const GoogleAdsenseMeta: FC = () => {
  return (
    <>
      <meta name="google-adsense-account" content="ca-pub-1941263261411851" />
    </>
  );
};
