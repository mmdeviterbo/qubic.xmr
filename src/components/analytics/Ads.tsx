export default function Ads() {
  return (
    <>
      <script
        src="https://cmp.gatekeeperconsent.com/min.js"
        data-cfasync="false"
      ></script>
      <script
        src="https://the.gatekeeperconsent.com/cmp.min.js"
        data-cfasync="false"
      ></script>

      <script async src="//www.ezojs.com/ezoic/sa.min.js"></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `
          window.ezstandalone = window.ezstandalone || {};
          ezstandalone.cmd = ezstandalone.cmd || [];
        `,
        }}
      ></script>
    </>
  );
}
