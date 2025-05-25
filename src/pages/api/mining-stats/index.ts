import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

import type { MiningStats } from "@/types/MiningStats";
import { QUBIC_XMR_STATS_URL } from "@/utils/constants";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MiningStats>,
) {
  try {
    const newMiningStats: MiningStats = (await axios.get(QUBIC_XMR_STATS_URL))
      .data;

    res.status(200).json(newMiningStats);
  } catch (error) {
    res.status(400);
  }
}
