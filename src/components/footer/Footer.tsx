import { type FC, Fragment, memo, useMemo } from "react";
import Link from "next/link";
import {
  DONATE_X_URL,
  QUBIC_XMR_STATS_URL,
  QUBIC_XMR_STREAMLIT_APP_URL,
  TARI_BLOCKS_HISTORY_URL,
} from "@/utils/constants";
import useBreakpoints from "@/hooks/useBreakpoints";

const Footer: FC = () => {
  const { isMd, isLg } = useBreakpoints();

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

  // <svg className="w-5 h-5 text-gray-500 transition group-open:rotate-90" xmlns="http://www.w3.org/2000/svg"
  //     width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
  //     <path fill-rule="evenodd"
  //         d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z">
  //     </path>
  // </svg>

  return (
    <div
      className="px-1 md:px-0 flex flex-col md:flex-row gap-2 justify-center mt-6 text-gray-50"
      style={{ fontSize: isMd || isLg ? "0.75rem" : "0.5rem" }}
    >
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
