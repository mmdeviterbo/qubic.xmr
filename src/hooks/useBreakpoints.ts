import { useLayoutEffect, useState } from "react";

interface UseBreakpoints {
  isSm: boolean;
  isMd: boolean;
}

const useBreakpoints = (): UseBreakpoints => {
  const [isSm, setIsSm] = useState(false);
  const [isMd, setIsMd] = useState(false);

  useLayoutEffect(() => {
    function handleResize() {
      setIsSm(window.innerWidth < 460);
      setIsMd(window.innerWidth >= 460 && window.innerWidth < 768);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { isSm, isMd };
};

export default useBreakpoints;
