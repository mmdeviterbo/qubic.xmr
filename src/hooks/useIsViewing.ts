import { useEffect, useState } from "react";
import debounce from "lodash/debounce";

const useIsViewing = () => {
  const [isViewing, setIsViewing] = useState(false);
  const set = debounce(
    () => setIsViewing(document.visibilityState === "visible"),
    100,
  );
  useEffect(() => {
    set();
  });
  return isViewing;
};

export default useIsViewing;
