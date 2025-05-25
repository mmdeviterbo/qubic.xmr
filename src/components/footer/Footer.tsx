import { type FC, memo } from "react";
import Link from "next/link";
import { QUBIC_XMR_STATS_URL } from "@/utils/constants";

const Footer: FC = () => {
  return (
    <div className="flex mt-4 gap-4 text-gray-50 text-xs underline">
      <Link href={QUBIC_XMR_STATS_URL.replace("/stats", "")}>Live data</Link>
    </div>
  );
};

export default memo(Footer);
