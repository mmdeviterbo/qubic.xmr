import Script from "next/script";

export default function Ads() {
  return (
    <>
      <Script
        src="https://cmp.gatekeeperconsent.com/min.js"
        strategy="afterInteractive"
      ></Script>
      <Script
        src="https://the.gatekeeperconsent.com/cmp.min.js"
        strategy="afterInteractive"
      ></Script>

      <Script async src="//www.ezojs.com/ezoic/sa.min.js"></Script>
      <Script
        dangerouslySetInnerHTML={{
          __html: `
          window.ezstandalone = window.ezstandalone || {};
          ezstandalone.cmd = ezstandalone.cmd || [];
        `,
        }}
      ></Script>
    </>
  );
}
