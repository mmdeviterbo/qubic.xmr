import { type FC, memo, useMemo } from "react";
import {
  BUY_CFB_TOKEN_URL,
  CFB_DISCORD_URL,
  CFB_TOKEN_URL,
  CFB_TOKEN_X_URL,
  DONATE_X_URL,
  // DONATE_X_URL,
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
        label: "Buy me a coffee (spanish latte)",
        href: DONATE_X_URL,
      },
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
    ];
  }, []);

  const rightLinks = useMemo(() => {
    return [
      {
        label: "Trade $CFB",
        href: BUY_CFB_TOKEN_URL,
      },
      {
        label: "$CFB Webpage",
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

  return (
    <div className="flex flex-col mb-1">
      <div
        className="flex items-start justify-evenly my-4 text-gray-50"
        style={{
          fontSize: isMd || isLg ? "0.75rem" : "0.65rem",
          marginTop: isMd || isLg ? 50 : 40,
        }}
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
              • {l.label}
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
              • {l.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default memo(Footer);
