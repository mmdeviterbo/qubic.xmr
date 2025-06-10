import { type FC, Fragment, memo, useMemo } from "react";
import Link from "next/link";
import {
  DONATE_X_URL,
  QUBIC_XMR_STATS_URL,
  QUBIC_XMR_STREAMLIT_APP_URL,
} from "@/utils/constants";

const Footer: FC = () => {
  const links = useMemo(() => {
    return [
      {
        label: "Live stats",
        href: QUBIC_XMR_STATS_URL,
      },
      {
        label: "Detailed stats",
        href: QUBIC_XMR_STREAMLIT_APP_URL,
      },
    ];
  }, []);

  return (
    <div className="px-1 md:px-0 flex justify-between mt-4 text-gray-50 text-xs">
      <div className="flex gap-2">
        {links.map((l, i) => (
          <Fragment key={l.label}>
            <Link className="underline underline-offset-3" href={l.href}>
              {l.label}
            </Link>
            {i !== links.length - 1 && <span>|</span>}
          </Fragment>
        ))}
      </div>
      <Link className="underline underline-offset-3" href={DONATE_X_URL}>
        Donate
      </Link>
    </div>
  );
};

export default memo(Footer);
