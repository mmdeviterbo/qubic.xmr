import { memo, useMemo, type FC } from "react";
import Marquee from "react-fast-marquee";
import { openCfbTokenSite } from "./CfbToken";

const CfbMarquee: FC = () => {
  const marginRight = useMemo(() => "mr-4 md:mr-6", []);

  const separatorPeriod = useMemo(
    () => (
      <span
        className={`text-3xl md:text-4xl ${marginRight}`}
        style={{
          WebkitUserSelect: "none",
          msUserSelect: "none",
          userSelect: "none",
        }}
      >
        •
      </span>
    ),
    [],
  );

  return (
    <Marquee
      style={{ zIndex: 25 }}
      gradient={true}
      gradientColor="rgb(16 24 32 / var(--tw-bg-opacity))"
      gradientWidth={25}
      autoFill
      className="tracking-wider my-2 md:my-4 grid place-items-center text-xl sm:text-2xl"
    >
      <span
        onClick={openCfbTokenSite}
        className="cfb-token-text cursor-pointer"
        style={{
          WebkitUserSelect: "none",
          msUserSelect: "none",
          userSelect: "none",
        }}
      >
        Powered by&nbsp;
        <span
          className={`md:ml-1 ${marginRight}`}
          style={{
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundImage:
              "linear-gradient(0deg, rgb(255, 212, 107) 0%, rgb(196, 61, 47) 100%)",
          }}
        >
          $CFB
        </span>
      </span>

      {separatorPeriod}

      <span
        className={`cfb-token-text cursor-pointer ${marginRight}`}
        onClick={openCfbTokenSite}
        style={{
          WebkitUserSelect: "none",
          msUserSelect: "none",
          userSelect: "none",
        }}
      >
        1st memecoin on Qubic
      </span>

      {separatorPeriod}
    </Marquee>
  );
};

export default memo(CfbMarquee);
