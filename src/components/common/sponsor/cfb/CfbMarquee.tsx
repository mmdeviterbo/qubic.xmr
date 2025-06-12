import { memo, type FC } from "react";
import Marquee from "react-fast-marquee";
import { openCfbTokenSite } from "./CfbToken";

const CfbMarquee: FC = () => {
  const marginRight = "mr-4 md:mr-6";

  return (
    <Marquee
      style={{ zIndex: 100 }}
      gradient={true}
      gradientColor="rgb(16 24 32 / var(--tw-bg-opacity))"
      gradientWidth={25}
      autoFill
      className="cfb-token-text tracking-wide grid items-center text-sm sm:text-lg md:text-xl"
    >
      <span onClick={openCfbTokenSite} className="cursor-pointer">
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

      <span className={marginRight}>•</span>

      <span className="cursor-pointer">
        1st memecoin on&nbsp;
        <span className={marginRight}>Qubic</span>
      </span>

      <span className={`${marginRight}`}>•</span>
    </Marquee>
  );
};

export default memo(CfbMarquee);
