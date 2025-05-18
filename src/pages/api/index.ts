import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

import prisma from "@/db/lib/prisma";

import { MiningStats } from "@/types/MiningStats";
import { QUBIC_XMR_STATS_URL } from "@/utils/constants";

const saveAndGetHighestPoolHashrate = async (newMiningStats: MiningStats) => {
  try {
    const currentMiningStatsWithHighestPoolHashrate =
      await prisma.miningStats.findFirst();

    if (!currentMiningStatsWithHighestPoolHashrate) {
      const createdMiningStats = await prisma.miningStats.create({
        data: {
          highest_pool_hashrate: newMiningStats.pool_hashrate,
        },
      });
      return createdMiningStats.highest_pool_hashrate;
    }

    const currentHighestPoolHashrate =
      currentMiningStatsWithHighestPoolHashrate.highest_pool_hashrate;
    const newPoolHashrate = newMiningStats.pool_hashrate;
    if (currentHighestPoolHashrate < newPoolHashrate) {
      const updatedMiningStats = await prisma.miningStats.update({
        data: {
          highest_pool_hashrate: newPoolHashrate,
        },
        where: { id: currentMiningStatsWithHighestPoolHashrate.id },
      });
      return updatedMiningStats.highest_pool_hashrate;
    }
    return currentMiningStatsWithHighestPoolHashrate.highest_pool_hashrate;
  } catch (error) {
    return 0;
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MiningStats>,
) {
  try {
    const newtMiningStats: MiningStats = (await axios.get(QUBIC_XMR_STATS_URL))
      .data;

    newtMiningStats.highest_pool_hashrate =
      (await saveAndGetHighestPoolHashrate(newtMiningStats)) as number;

    res.status(200).json(newtMiningStats);
  } catch (error) {
    res.status(400);
  }
}
