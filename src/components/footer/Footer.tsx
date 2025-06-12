import { type FC, Fragment, memo, useMemo } from "react";
import Link from "next/link";
import {
  DONATE_X_URL,
  QUBIC_XMR_STATS_URL,
  QUBIC_XMR_STREAMLIT_APP_URL,
  TARI_BLOCKS_HISTORY_URL,
} from "@/utils/constants";

const Footer: FC = () => {
  const links = useMemo(() => {
    return [
      {
        label: "Qubic Official Stats",
        href: QUBIC_XMR_STATS_URL,
      },
      {
        label: "Qubic-Tari Live Stats",
        href: TARI_BLOCKS_HISTORY_URL,
      },
      {
        label: "Qubic-Monero Detailed Stats",
        href: QUBIC_XMR_STREAMLIT_APP_URL,
      },
      {
        label: "Donate",
        href: DONATE_X_URL,
      },
    ];
  }, []);

  return (
    <div className="px-1 md:px-0 flex flex-col md:flex-row gap-2 justify-center mt-8 text-gray-50 text-xs">
      {links.map((l, i) => (
        <Fragment key={l.label}>
          <Link className="underline underline-offset-2" href={l.href}>
            {l.label}
          </Link>

          {i !== links.length - 1 && (
            <span className="hidden md:inline-block">|</span>
          )}
        </Fragment>
      ))}
    </div>
  );
};

export default memo(Footer);
