import { memo, useLayoutEffect, useState } from "react";
import Image from "next/image";

const CfbToken = () => {
  const [height, setHeight] = useState(110);
  const [width, setWidth] = useState(110);

  useLayoutEffect(() => {
    function handleResize() {
      const windowWidth = window.innerWidth;
      if (windowWidth >= 560) {
        setWidth(110);
        setHeight(110);
      } else {
        setWidth(85);
        setHeight(85);
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
      />
    </div>
  );
};

export default memo(CfbToken);
