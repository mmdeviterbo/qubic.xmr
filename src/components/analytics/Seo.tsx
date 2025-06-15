import { type FC } from "react";

export const SeoMeta: FC = () => {
  return (
    <>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="robots" content="index, follow" />
      <meta
        name="description"
        content={
          "Qubic Custom Mining (PoC) as the first to execute Useful Proof of Work (UPoW). Sponsored by $CFB - a first memecoin on Qubic. UI made by Marty de Viterbo."
        }
      />
    </>
  );
};
