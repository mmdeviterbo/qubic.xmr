import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import orderBy from "lodash/orderBy";

import type { MiningStats } from "@/types/MiningStats";
import {
  ABOUT_ME_NOTE,
  blockToXMRConversion,
  MONERO_MINING_LATEST_BLOCK_FOUND_URL,
  MONERO_MINING_POOLS_STATS_URL,
  QUBIC_XMR_STATS_API_URL,
  QUBIC_XMR_STATS_URL,
} from "@/utils/constants";

const getRankingByPoolHashrate = (
  data: Array<Record<"hashrate" | "url", unknown>>,
): number => {
  const sortPools = orderBy(data, (a) => Number(a.hashrate), "desc");
  return sortPools.findIndex((s) => s.url === QUBIC_XMR_STATS_URL) + 1;
};

async function getMiningAveragesAndRanking(accurate_qubic_hashrate: number) {
  try {
    const latestBlockFoundTime: number = (
      await axios.get(MONERO_MINING_LATEST_BLOCK_FOUND_URL())
    )?.data;

    const pools: Record<string, number | string>[] = (
      await axios.get(MONERO_MINING_POOLS_STATS_URL(latestBlockFoundTime))
    )?.data?.data;

    const qubicPool = pools?.find((p) => p.url === QUBIC_XMR_STATS_URL);
    qubicPool.hashrate = accurate_qubic_hashrate;

    if (!qubicPool) {
      throw new Error();
    }

    const poolsWithUpdatedQubicHashrate = pools?.map((pool) =>
      pool.url === QUBIC_XMR_STATS_URL ? qubicPool : pool,
    );

    return {
      hashrate_average_7d: qubicPool.hashrate_average_7d as number,
      hashrate_average_1h: qubicPool.hashrate_average_1h as number,
      pool_hashrate_ranking: getRankingByPoolHashrate(
        poolsWithUpdatedQubicHashrate,
      ),
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
    let {
      pool_hashrate,
      network_hashrate,
      connected_miners,
      last_block_found,
      pool_blocks_found,
    } = (await axios.get(QUBIC_XMR_STATS_API_URL)).data;

    let newMiningStats: MiningStats;

    const averagesAndRanking = await getMiningAveragesAndRanking(pool_hashrate);
    if (averagesAndRanking) {
      newMiningStats = {
        pool_hashrate,
        network_hashrate,
        connected_miners,
        monero_blocks_found: {
          pool_blocks_found,
          last_block_found,
          total_rewards: pool_blocks_found * blockToXMRConversion,
        },
        hashrate_averages: {
          hashrate_average_1h: averagesAndRanking?.hashrate_average_1h ?? 0,
          hashrate_average_7d: averagesAndRanking?.hashrate_average_7d ?? 0,
        },
        pool_hashrate_ranking: averagesAndRanking?.pool_hashrate_ranking ?? 0,
        developer: ABOUT_ME_NOTE,
      };
    }

    res.setHeader("Cache-Control", "public, max-age=15");
    res.setHeader("CDN-Cache-Control", "public, max-age=30");
    res.setHeader("Vercel-CDN-Cache-Control", "public, max-age=60");

    res.status(200).json(newMiningStats);
  } catch (error) {
    res.status(400);
  }
}
