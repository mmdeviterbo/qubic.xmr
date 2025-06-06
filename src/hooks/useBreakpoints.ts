import { useLayoutEffect, useState } from "react";

interface UseBreakpoints {
  isXs: boolean;
}

const useBreakpoints = (): UseBreakpoints => {
  const [isXs, setIsXs] = useState(false);

  useLayoutEffect(() => {
    function handleResize() {
      setIsXs(window.innerWidth < 460);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { isXs };
};

export default useBreakpoints;
