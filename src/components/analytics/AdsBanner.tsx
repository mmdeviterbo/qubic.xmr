'use client'
import { useEffect, useRef, useState } from "react";
import Script from "next/script";

export default function AdBanner() {
  const adRef = useRef<HTMLDivElement>(null);
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    if (!adRef.current || adLoaded) return;

    const timeout = setTimeout(() => {
      try {
        // Only push if the ad hasn't been rendered yet
        if (!adRef.current?.querySelector("iframe")) {
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
          setAdLoaded(true);
        }
      } catch (e) {
        console.error("Adsense error:", e);
      }
    }, 500); // give the <script> a moment to load

    return () => clearTimeout(timeout);
  }, [adLoaded]);

  return (
    <>
      <Script
        id="adsense-script"
        strategy="afterInteractive"
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1941263261411851"
        crossOrigin="anonymous"
      />
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-1941263261411851"
        data-ad-slot="6720393341"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </>
  );
}
