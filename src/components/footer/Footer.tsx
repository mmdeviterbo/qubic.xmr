import { type FC, memo, useMemo } from "react";
import {
  BUY_CFB_TOKEN_URL,
  CFB_DISCORD_URL,
  CFB_TOKEN_URL,
  CFB_TOKEN_X_URL,
  DONATE_X_URL,
  QUBIC_XMR_STATS_URL,
  QUBIC_XMR_STREAMLIT_APP_URL,
  TARI_BLOCKS_HISTORY_URL,
} from "@/utils/constants";
import useBreakpoints from "@/hooks/useBreakpoints";

const Footer: FC = () => {
  const { isMd, isLg } = useBreakpoints();

  const leftLinks = useMemo(() => {
    return [
      {
        label: "Official Stats",
        href: QUBIC_XMR_STATS_URL,
      },
      {
        label: "Qubic-Tari Live Stats",
        href: TARI_BLOCKS_HISTORY_URL,
      },
      {
        label: "Qubic-Monero Live Stats",
        href: QUBIC_XMR_STREAMLIT_APP_URL,
      },
      {
        label: "Donate",
        href: DONATE_X_URL,
      },
    ];
  }, []);

  const rightLinks = useMemo(() => {
    return [
      {
        label: "Buy $CFB",
        href: BUY_CFB_TOKEN_URL,
      },
      {
        label: "$CFB Offical Webpage",
        href: CFB_TOKEN_URL,
      },
      {
        label: "$CFB Offical X",
        href: CFB_TOKEN_X_URL,
      },
      {
        label: "$CFB Discord",
        href: CFB_DISCORD_URL,
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
      className="flex items-start justify-evenly my-10 mt-15 text-gray-50"
      style={{ fontSize: isMd || isLg ? "0.75rem" : "0.65rem" }}
    >
      <div className="flex flex-col gap-1.5 justify-center">
        {leftLinks.map((l, i) => (
          <a
            key={l.label}
            className="w-fit hover:text-white"
            target="_blank"
            href={l.href}
            rel="noopener noreferrer"
          >
            {l.label}
          </a>
        ))}
      </div>
      <div className="flex flex-col gap-1.5 justify-center">
        {rightLinks.map((l, i) => (
          <a
            key={l.label}
            className="w-fit hover:text-white"
            target="_blank"
            href={l.href}
            rel="noopener noreferrer"
          >
            {l.label}
          </a>
        ))}
      </div>
    </div>
  );
};

export default memo(Footer);
