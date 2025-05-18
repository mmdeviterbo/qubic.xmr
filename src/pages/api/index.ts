import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

import { MiningStats } from "@/types/MiningStats";
import { QUBIC_XMR_STATS_URL } from "@/utils/constants";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MiningStats>,
) {
  let stats = (await axios.get(QUBIC_XMR_STATS_URL)).data;
  res.status(200).json(stats);
}
