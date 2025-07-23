"use client";
import { type FC, useEffect, useLayoutEffect, useState } from "react";
import ReactCardFlip from "react-card-flip";
import Image from "next/image";
import { CFB_TOKEN_URL } from "@/utils/constants";

export const openCfbTokenSite = () =>
  window.open(CFB_TOKEN_URL, "_blank", "noopener");

const CfbToken: FC<{ customClass?: string }> = ({
  customClass = "bottom-0",
}) => {
  const [width, setWidth] = useState(130);

  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFlipped((prev) => !prev);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useLayoutEffect(() => {
    function handleResize() {
      const windowWidth = window.innerWidth;
      if (windowWidth >= 1024) {
        setWidth(155);
      } else if (windowWidth >= 768) {
        setWidth(145);
      } else if (windowWidth >= 560) {
        setWidth(135);
      } else if (windowWidth >= 375) {
        setWidth(130);
      } else {
        setWidth(120);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div
        id="cfb-token-container"
        className={`absolute flex items-center gap-0.5 md:gap-8 z-100 right-6 md:right-10 ${customClass}`}
      >
        <ReactCardFlip
          isFlipped={isFlipped}
          flipDirection="horizontal"
          infinite={true}
        >
          <Image
            id="cfb-token"
            onClick={openCfbTokenSite}
            style={{ zIndex: 25 }}
            className="cursor-pointer"
            alt="CFB Token"
            src="/super_monero.png"
            width={width}
            height={width}
            draggable={false}
          />
          <Image
            id="cfb-token"
            onClick={openCfbTokenSite}
            style={{ zIndex: 25 }}
            className="cursor-pointer"
            alt="CFB Token"
            src="/cfb_dai.png"
            width={width}
            height={width}
            draggable={false}
          />
        </ReactCardFlip>
      </div>
    </>
  );
};

export default CfbToken;
