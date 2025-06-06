import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

import type { MiningStats } from "@/types/MiningStats";
import {
  MONERO_MINING_LATEST_BLOCK_FOUND_URL,
  MONERO_MINING_POOLS_STATS_URL,
  QUBIC_XMR_STATS_URL,
} from "@/utils/constants";

async function getMiningAverages() {
  try {
    const latestBlockFoundTime: number = (
      await axios.get(MONERO_MINING_LATEST_BLOCK_FOUND_URL())
    )?.data;

    const pools: Record<string, number | string>[] = (
      await axios.get(MONERO_MINING_POOLS_STATS_URL(latestBlockFoundTime))
    )?.data?.data;

    const qubicStatsUrl = QUBIC_XMR_STATS_URL.replace("/stats", "");
    const qubicPool = pools?.find((p) => p.url === qubicStatsUrl);

    if (!qubicPool) {
      throw new Error();
    }

    return {
      hashrate_average_7d: qubicPool.hashrate_average_7d as number,
      hashrate_average_1h: qubicPool.hashrate_average_1h as number,
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
    let newMiningStats: MiningStats = (await axios.get(QUBIC_XMR_STATS_URL))
      .data;

    const averages = await getMiningAverages();
    if (averages) {
      newMiningStats = {
        ...newMiningStats,
        ...(averages ? averages : {}),
      };
    }

    res.setHeader(
      "Cache-Control",
      "public, max-age=15, stale-while-revalidate=10",
    );
    res.setHeader(
      "CDN-Cache-Control",
      "public, max-age=25, stale-while-revalidate=10",
    );
    res.setHeader(
      "Vercel-CDN-Cache-Control",
      "public, s-maxage=30, stale-while-revalidate=10",
    );

    res.status(200).json(newMiningStats);
  } catch (error) {
    res.status(400);
  }
}
