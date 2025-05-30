import { memo, useLayoutEffect, useState } from "react";
import Image from "next/image";

const CfbToken = () => {
  const [height, setHeight] = useState(130);
  const [width, setWidth] = useState(130);

  useLayoutEffect(() => {
    function handleResize() {
      const windowWidth = window.innerWidth;
      if (windowWidth >= 1024) {
        setWidth(130);
        setHeight(130);
      } else if (windowWidth >= 768) {
        setWidth(120);
        setHeight(120);
      } else if (windowWidth >= 560) {
        setWidth(100);
        setHeight(100);
      } else if (windowWidth >= 375) {
        setWidth(90);
        setHeight(90);
      } else {
        setWidth(80);
        setHeight(80);
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="absolute bottom-0 right-4">
      <Image
        id="cfb-token"
        onClick={() =>
          window.open("https://cfbtoken.com", "_blank", "noopener")
        }
        className="cursor-pointer"
        alt="CFB Token"
        src="/CFB_XMR.png"
        width={width}
        height={height}
        draggable={false}
        priority={true}
      />
    </div>
  );
};

export default memo(CfbToken);
