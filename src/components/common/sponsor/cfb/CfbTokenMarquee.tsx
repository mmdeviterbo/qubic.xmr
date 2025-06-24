import {
  Fragment,
  memo,
  useLayoutEffect,
  useMemo,
  useState,
  type FC,
} from "react";
import Image from "next/image";
import Marquee from "react-fast-marquee";

import { openCfbTokenSite } from "./CfbToken";

const CfbTokenMarquee: FC = () => {
  const [width, setWidth] = useState(50);

  const marginRight = useMemo(() => "mr-4 md:mr-6", []);

  const cfbImagePaths = useMemo(() => {
    return [
      "/marquee/cfb-brainy.png",
      "/marquee/cfb-broly.png",
      "/marquee/cfb-cyberpunk-ronin.png",
      "/marquee/cfb-default.png",
      "/marquee/cfb-dwarf.png",
      "/marquee/cfb-giga-chad.png",
      "/marquee/cfb-logan.png",
      "/marquee/cfb-luffy.png",
    ];
  }, []);

  useLayoutEffect(() => {
    function handleResize() {
      const windowWidth = window.innerWidth;
      if (windowWidth >= 1024) {
        setWidth(140);
      } else if (windowWidth >= 768) {
        setWidth(135);
      } else if (windowWidth >= 560) {
        setWidth(135);
      } else {
        setWidth(135);
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
        className="flex items-center justify-center my-1"
        onClick={openCfbTokenSite}
      >
        {cfbImagePaths.map((path) => (
          <Fragment key={path}>
            <Image
              quality={80}
              src={path}
              alt={path
                .replace("/marquee/", "")
                .replace("-", " ")
                .replace(".png", "")
                .toUpperCase()}
              width={width}
              height={width}
              className="cursor-pointer hover:scale-110 transition-all"
            />
            <span
              className="mx-6 cursor-pointer tracking-wider hover:scale-110 transition-all cfb-token-text white text-5xl md:text-6xl"
              style={{
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundImage:
                  "linear-gradient(0deg, rgb(255, 212, 107) 0%, rgb(186, 77, 65) 100%)",
              }}
            >
              $CFB
            </span>
          </Fragment>
        ))}
      </div>
    </Marquee>
  );
};

export default memo(CfbTokenMarquee);
