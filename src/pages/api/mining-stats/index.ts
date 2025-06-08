import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import sortBy from "lodash/sortBy";

import type { MiningStats } from "@/types/MiningStats";
import {
  MONERO_MINING_LATEST_BLOCK_FOUND_URL,
  MONERO_MINING_POOLS_STATS_URL,
  QUBIC_XMR_STATS_API_URL,
  QUBIC_XMR_STATS_URL,
} from "@/utils/constants";

const getRankingByPoolHashrate = (
  data: Array<Record<"hashrate" | "url", unknown>>,
): number => {
  const sortPools = sortBy(data, (a) => Number(a.hashrate));
  return sortPools.findIndex((s) => s.url === QUBIC_XMR_STATS_URL);
};

async function getMiningAveragesAndRanking() {
  try {
    const latestBlockFoundTime: number = (
      await axios.get(MONERO_MINING_LATEST_BLOCK_FOUND_URL())
    )?.data;

    const pools: Record<string, number | string>[] = (
      await axios.get(MONERO_MINING_POOLS_STATS_URL(latestBlockFoundTime))
    )?.data?.data;

    const qubicPool = pools?.find((p) => p.url === QUBIC_XMR_STATS_URL);

    if (!qubicPool) {
      throw new Error();
    }

    return {
      hashrate_average_7d: qubicPool.hashrate_average_7d as number,
      hashrate_average_1h: qubicPool.hashrate_average_1h as number,
      pool_hashrate_ranking: getRankingByPoolHashrate(pools),
    };
  } catch (e) {
    return null;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MiningStats>,
) {
  try {
    let newMiningStats: MiningStats = (await axios.get(QUBIC_XMR_STATS_API_URL))
      .data;

    const averages = await getMiningAveragesAndRanking();
    if (averages) {
      newMiningStats = {
        ...newMiningStats,
        ...(averages ? averages : {}),
      };
    }

    res.setHeader("Cache-Control", "public, max-age=15");
    res.setHeader("CDN-Cache-Control", "public, max-age=25");
    res.setHeader("Vercel-CDN-Cache-Control", "public, s-maxage=30");

    res.status(200).json(newMiningStats);
  } catch (error) {
    res.status(400);
  }
}
