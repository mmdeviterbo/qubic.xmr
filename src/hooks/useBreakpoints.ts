import { useLayoutEffect, useState } from "react";

interface UseBreakpoints {
  isSm: boolean;
  isMd: boolean;
  isLg: boolean;
}

const useBreakpoints = (): UseBreakpoints => {
  const [isSm, setIsSm] = useState(false);
  const [isMd, setIsMd] = useState(false);
  const [isLg, setIsLg] = useState(false);

  useLayoutEffect(() => {
    function handleResize() {
      setIsSm(window.innerWidth < 460);
      setIsMd(window.innerWidth >= 460 && window.innerWidth < 768);
      setIsLg(window.innerWidth >= 768);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { isSm, isMd, isLg };
};

export default useBreakpoints;
