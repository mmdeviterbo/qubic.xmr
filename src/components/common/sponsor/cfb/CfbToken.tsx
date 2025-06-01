import { FC, useLayoutEffect, useState } from "react";
import Image from "next/image";
import Fire from "@/components/effects/Fire";

export const SuperCfbToken: FC<{ customClass?: string; showFire: boolean }> = ({
  customClass = "bottom-0",
  showFire = false,
}) => {
  const [width, setWidth] = useState(130);

  useLayoutEffect(() => {
    function handleResize() {
      const windowWidth = window.innerWidth;
      if (windowWidth >= 1024) {
        setWidth(130);
      } else if (windowWidth >= 768) {
        setWidth(120);
      } else if (windowWidth >= 560) {
        setWidth(110);
      } else if (windowWidth >= 375) {
        setWidth(100);
      } else {
        setWidth(90);
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
        id="cfb-token-100th-block-container"
        className={`absolute z-100 right-4 ${customClass}`}
      >
        <Image
          id="cfb-token-100th-block"
          onClick={() =>
            window.open("https://cfbtoken.com", "_blank", "noopener")
          }
          style={{ zIndex: 100 }}
          className="cursor-pointer"
          alt="CFB Token"
          src="/super_monero.png"
          width={width * 1.05}
          height={width * 1.05}
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
//         className="absolute bottom-0 right-4 border"
//         style={{ zIndex: 100 }}
//       >
//         <Image
//           id="cfb-token"
//           onClick={() =>
//             window.open("https://cfbtoken.com", "_blank", "noopener")
//           }
//           className="cursor-pointer"
//           alt="CFB Token"
//           src="/CFB_XMR.png"
//           width={width}
//           height={width}
//           draggable={false}
//         />
//       </div>

//       <SuperCfbToken customClass="bottom-70" />
//     </>
//   );
// };
