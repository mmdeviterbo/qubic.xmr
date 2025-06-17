import { memo, useLayoutEffect, useMemo, useState, type FC } from "react";
import Marquee from "react-fast-marquee";
import { openCfbTokenSite } from "./CfbToken";
import Image from "next/image";

const CfbTokenMarquee: FC = () => {
  const [width, setWidth] = useState(50);

  const marginRight = useMemo(() => "mr-4 md:mr-6", []);

  const separatorPeriod = useMemo(
    () => <span className={`text-3xl md:text-4xl ${marginRight}`}>•</span>,
    [],
  );

  useLayoutEffect(() => {
    function handleResize() {
      const windowWidth = window.innerWidth;
      if (windowWidth >= 1024) {
        setWidth(60);
      } else if (windowWidth >= 768) {
        setWidth(55);
      } else if (windowWidth >= 560) {
        setWidth(50);
      } else {
        setWidth(45);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Marquee
      gradient={true}
      gradientColor="rgb(16 24 32 / var(--tw-bg-opacity))"
      gradientWidth={25}
      autoFill
    >
      <div
        className="cursor-pointer flex items-center gap-1 md:gap-2 mx-4 md:mx-8 my-1"
        onClick={openCfbTokenSite}
      >
        <Image
          className="hover:scale-110 transition-all"
          alt="CFB Token"
          src="/cfb_token.png"
          width={width}
          height={width}
          draggable={false}
        />
        <span className="hover:scale-110 transition-all cfb-token-text white text-3xl md:text-4xl">
          $CFB
        </span>
      </div>
    </Marquee>
  );
};

export default memo(CfbTokenMarquee);
