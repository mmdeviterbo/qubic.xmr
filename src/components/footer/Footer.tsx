import { type FC, memo, useCallback } from "react";
import Link from "next/link";
import { QUBIC_XMR_STATS_URL } from "@/utils/constants";

const Footer: FC = () => {
  const openMultipleTabs = useCallback(() => {
    const urls = ["https://qubic-xmr-stats.streamlit.app"];
    urls.forEach((url) => {
      window.open(url, "_blank", "noopener,noreferrer");
    });
  }, []);

  return (
    <div className="flex mt-4 gap-2 text-gray-50 text-xs underline">
      <Link href={QUBIC_XMR_STATS_URL.replace("/stats", "")}>Live data</Link>
      <span>|</span>
      <Link href={""} onClick={openMultipleTabs}>
        Dive Deeper
      </Link>
    </div>
  );
};

export default memo(Footer);
