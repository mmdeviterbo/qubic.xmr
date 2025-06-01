import { memo, useEffect, useState, type FC } from "react";

import fireStyles from "@/styles/fire.module.css";

interface FireProps {
  show?: boolean;
}
const Fire: FC<FireProps> = ({ show = false }) => {
  const [_show, set_Show] = useState(false);

  useEffect(() => {
    if (show) {
      set_Show(true);
    }

    if (!show) {
      set_Show(false);
    }
  }, [show]);

  return (
    <div
      className={`transition duration-1000 absolute z-2 right-0 sm:right-2 md:right-5 bottom-[-10] ${_show ? "opacity-85" : "opacity-0"}`}
    >
      <div
        className={`transition relative duration-1000 ${_show ? "opacity-85" : "opacity-0"} w-8 h-10 md:h-10 md:w-10 ${fireStyles.fire}`}
      >
        {[...Array(60).keys()].map((i) => (
          <div
            key={i}
            className={`transition duration-1000 h-10 w-8 md:h-10 md:w-12 ${fireStyles.particle}`}
          />
        ))}
      </div>
    </div>
  );
};

export default memo<FireProps>(Fire);
