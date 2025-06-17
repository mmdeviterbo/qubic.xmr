import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import orderBy from "lodash/orderBy";

import type { MiningStats, MoneroBlockDistribution } from "@/types/MiningStats";
import {
  ABOUT_ME_NOTE,
  blockToXMRConversion,
  MONERO_MINING_BLOCK_DISTRIBUTION_URL,
  MONERO_MINING_LATEST_BLOCK_FOUND_URL,
  MONERO_MINING_POOLS_STATS_URL,
  QUBIC_URL,
  QUBIC_XMR_STATS_API_URL,
  QUBIC_XMR_STATS_URL,
} from "@/utils/constants";

const getMiningPoolsStats = async () => {
  const latestBlockFoundTime: number = (
    await axios.get(MONERO_MINING_LATEST_BLOCK_FOUND_URL())
  )?.data;

  const poolsStats: Record<string, number | string>[] = (
    await axios.get(MONERO_MINING_POOLS_STATS_URL(latestBlockFoundTime))
  )?.data?.data;

  return poolsStats;
};

const getBlockDistributions = async () => {
  const latestBlockFoundTime: number = (
    await axios.get(MONERO_MINING_LATEST_BLOCK_FOUND_URL())
  )?.data;

  const blockDistributions: MoneroBlockDistribution = (
    await axios.get(MONERO_MINING_BLOCK_DISTRIBUTION_URL(latestBlockFoundTime))
  )?.data;

  const last1000Blocks =
    blockDistributions?.distribution?.urls.find(
      (p) => p.url === QUBIC_URL || p.url === QUBIC_XMR_STATS_URL,
    )?.count ?? 0;

  const last100Blocks =
    blockDistributions?.urls.find(
      (p) => p.url === QUBIC_URL || p.url === QUBIC_XMR_STATS_URL,
    )?.count ?? 0;

  return { last1000Blocks, last100Blocks };
};

const getRankingByHashrate = (
  poolsStats: Record<string, number | string>[],
  accurate_qubic_hashrate: number,
): number => {
  const qubicPool = poolsStats?.find((p) => p.url === QUBIC_XMR_STATS_URL);
  qubicPool.hashrate = accurate_qubic_hashrate;

  const poolsWithUpdatedQubicHashrate = poolsStats?.map((pool) =>
    pool.url === QUBIC_XMR_STATS_URL ? qubicPool : pool,
  );

  const sortPools = orderBy(
    poolsWithUpdatedQubicHashrate,
    (a) => Number(a.hashrate),
    "desc",
  );
  return sortPools.findIndex((s) => s.url === QUBIC_XMR_STATS_URL) + 1;
};

const getHashrateAverages = (poolsStats: Record<string, number | string>[]) => {
  const qubicPool = poolsStats?.find((p) => p.url === QUBIC_XMR_STATS_URL);

  return {
    hashrate_average_7d: qubicPool.hashrate_average_7d as number,
    hashrate_average_1h: qubicPool.hashrate_average_1h as number,
  };
};

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

    const poolsStats = await getMiningPoolsStats();

    const hashrateAverages = getHashrateAverages(poolsStats);

    const hashrateRanking = getRankingByHashrate(poolsStats, pool_hashrate);

    const monero_block_distributions = await getBlockDistributions();

    const newMiningStats: MiningStats = {
      pool_hashrate,
      network_hashrate,
      connected_miners,
      monero_blocks_found: {
        pool_blocks_found,
        last_block_found,
        total_rewards: pool_blocks_found * blockToXMRConversion,
      },
      hashrate_averages: {
        hashrate_average_1h: hashrateAverages?.hashrate_average_1h ?? 0,
        hashrate_average_7d: hashrateAverages?.hashrate_average_7d ?? 0,
      },
      monero_block_distributions,
      pool_hashrate_ranking: hashrateRanking ?? 0,
      developer: ABOUT_ME_NOTE,
    };

    res.setHeader("Cache-Control", "public, max-age=10");
    res.setHeader("CDN-Cache-Control", "public, max-age=20");
    res.setHeader("Vercel-CDN-Cache-Control", "public, max-age=40");

    res.status(200).json(newMiningStats);
  } catch (error) {
    console.log("/api/mining-stats: ", error);
    res.status(403);
  }
}
