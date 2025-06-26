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
        className={`absolute z-25 right-4 md:right-6 ${customClass}`}
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
      </div>
    </>
  );
};

export default CfbToken;
