import type { NextApiRequest, NextApiResponse } from "next";

import axios from "axios";

import type { XTMHistoryCharts, XTMMiningHistory } from "@/types/MiningStats";
import { TARI_BLOCKS_HISTORY_API_URL } from "@/utils/constants";
import { calculateTotalXTM, getXtmChartHistory } from "@/utils/xtm-charts";

const getXtmBlocksHistory = async (): Promise<XTMMiningHistory> => {
  const { data, status } = await axios.get<XTMMiningHistory>(
    TARI_BLOCKS_HISTORY_API_URL,
  );
  return status === 200 ? data : null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<XTMHistoryCharts>,
) {
  try {
    let xtmHistory = await getXtmBlocksHistory();

    const { blocks_found_chart } = getXtmChartHistory(xtmHistory.blocks);

    const pool_blocks_found = xtmHistory.total_found;
    const last_block_found = xtmHistory.blocks.at(0).timestamp;
    const total_xtm = calculateTotalXTM(xtmHistory.blocks);

    res.setHeader("Cache-Control", "public, max-age=300");
    res.setHeader("CDN-Cache-Control", "public, max-age=420");
    res.setHeader("Vercel-CDN-Cache-Control", "public, max-age=540");

    res.status(200).json({
      total_xtm,
      pool_blocks_found,
      last_block_found,
      blocks_found_chart,
    });
  } catch (error) {
    console.log("error:", error);
    res.status(400);
  }
}
