import Script from "next/script";

export default function Ads() {
  return (
    <>
      <Script
        id="ezoic-cmp"
        src="https://cmp.gatekeeperconsent.com/min.js"
        strategy="afterInteractive"
      ></Script>
      <Script
        id="ezoic-the"
        src="https://the.gatekeeperconsent.com/cmp.min.js"
        strategy="afterInteractive"
      ></Script>

      <Script id="ez" async src="//www.ezojs.com/ezoic/sa.min.js"></Script>
      <Script
        id="eztandalone"
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
