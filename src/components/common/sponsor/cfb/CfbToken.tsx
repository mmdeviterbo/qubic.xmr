import { type FC, useLayoutEffect, useState } from "react";
import Image from "next/image";
import Fire from "@/components/effects/Fire";
import { CFB_TOKEN_URL } from "@/utils/constants";

export const openCfbTokenSite = () =>
  window.open(CFB_TOKEN_URL, "_blank", "noopener");

export const SuperCfbToken: FC<{ customClass?: string; showFire: boolean }> = ({
  customClass = "bottom-0",
  showFire = false,
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
      <Fire show={showFire} />
      <div
        id="cfb-token-container"
        className={`absolute z-100 right-4 md:right-6 ${customClass}`}
      >
        <Image
          id="cfb-token"
          onClick={openCfbTokenSite}
          style={{ zIndex: 100 }}
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

// export const CfbToken: FC = () => {
//   const [width, setWidth] = useState(130);

//   useLayoutEffect(() => {
//     function handleResize() {
//       const windowWidth = window.innerWidth;
//       if (windowWidth >= 1024) {
//         setWidth(130);
//       } else if (windowWidth >= 768) {
//         setWidth(120);
//       } else if (windowWidth >= 560) {
//         setWidth(110);
//       } else if (windowWidth >= 375) {
//         setWidth(100);
//       } else {
//         setWidth(90);
//       }
//     }
//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   return (
//     <>
//       <div
//         id="cfb-token-container"
//         className="h-full w-full"
//         style={{ zIndex: 100 }}
//       >
//         <Image
//           id="cfb-token"
//           onClick={() =>
//             window.open("https://cfbtoken.com", "_blank", "noopener")
//           }
//           className="cursor-pointer"
//           alt="CFB Qubic Monero Token"
//           src="/cfb_xmr.png"
//           width={width}
//           height={width}
//           draggable={false}
//         />
//       </div>
//     </>
//   );
// };
