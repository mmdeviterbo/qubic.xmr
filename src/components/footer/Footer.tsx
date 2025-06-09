import { type FC, memo, useCallback } from "react";
import Link from "next/link";
import {
  QUBIC_XMR_STATS_API_URL,
  QUBIC_XMR_STREAMLIT_APP_URL,
} from "@/utils/constants";

const Footer: FC = () => {
  const openMultipleTabs = useCallback(() => {
    const urls = [QUBIC_XMR_STREAMLIT_APP_URL];
    urls.forEach((url) => {
      window.open(url, "_blank", "noopener,noreferrer");
    });
  }, []);

  return (
    <div className="px-1 md:px-0 flex mt-4 gap-2 text-gray-50 text-xs underline">
      <Link href={QUBIC_XMR_STATS_API_URL.replace("/stats", "")}>
        Live stats
      </Link>
      <span>|</span>
      <Link href={""} onClick={openMultipleTabs}>
        Detailed stats
      </Link>
    </div>
  );
};

export default memo(Footer);
