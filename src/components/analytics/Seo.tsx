import { type FC } from "react";

export const SeoMeta: FC = () => {
  return (
    <>
      <title>Qubic Custom Mining</title>

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
        name="description"
        content={
          "Qubic Custom Mining (PoC) is the first to execute Useful Proof of Work (UPoW). Powered by $CFB on cfbtoken.com, a first memecoin on Qubic. UI made by Marty de Viterbo."
        }
      />
    </>
  );
};
