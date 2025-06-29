import { NextApiRequest, NextApiResponse } from "next";

import getTariCalculatedMiningStats from "@/apis/calculated-xtm-stats";
import { XTMHistoryCharts } from "@/types/MiningStats";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<XTMHistoryCharts>,
) {
  try {
    const tariMiningStats = await getTariCalculatedMiningStats();
    res.status(200).json(tariMiningStats);
  } catch (error) {
    res.status(400);
  }
}
