"use client";
import { type FC, useLayoutEffect, useState } from "react";
import Image from "next/image";
import { CFB_TOKEN_URL } from "@/utils/constants";

export const openCfbTokenSite = () =>
  window.open(CFB_TOKEN_URL, "_blank", "noopener");

const CfbToken: FC<{ customClass?: string }> = ({
  customClass = "bottom-0",
}) => {
  const [width, setWidth] = useState(130);

  useLayoutEffect(() => {
    function handleResize() {
      const windowWidth = window.innerWidth;
      if (windowWidth >= 1024) {
        setWidth(155);
      } else if (windowWidth >= 768) {
        setWidth(140);
      } else if (windowWidth >= 560) {
        setWidth(130);
      } else if (windowWidth >= 375) {
        setWidth(120);
      } else {
        setWidth(110);
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
        className={`absolute flex items-center gap-0.5 md:gap-8 z-100 right-4 md:right-6 ${customClass}`}
      >
        <div className="relative">
          <div className="wiggle z-100 italic bg-white border border-gray-300 rounded-lg p-2 md:p-4 w-fit text-gray-800 text-xs md:text-lg">
              Thanks on the <br /> free stress-test!
              <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 w-4 h-4 bg-white border-t border-r border-gray-300 rotate-45"></div>
          </div>
        </div>
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
      </div>
    </>
  );
};

export default CfbToken;
