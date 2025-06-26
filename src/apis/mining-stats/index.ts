import axios from "axios";
import orderBy from "lodash/orderBy";

import type { MiningStats, MoneroBlockDistribution } from "@/types/MiningStats";
import {
  ABOUT_ME_NOTE,
  blockToXMRConversion,
  isClient,
  MONERO_MINING_BLOCK_DISTRIBUTION_URL,
  MONERO_MINING_LATEST_BLOCK_FOUND_URL,
  MONERO_MINING_POOLS_STATS_URL,
  proxyUrl,
  QUBIC_URL,
  QUBIC_XMR_STATS_API_URL,
  QUBIC_XMR_STATS_URL,
} from "@/utils/constants";

const getMiningPoolsStats = async (latestBlockFoundTime: number) => {
  let poolsStatsUrl = MONERO_MINING_POOLS_STATS_URL(latestBlockFoundTime);
  poolsStatsUrl = isClient ? proxyUrl(poolsStatsUrl) : poolsStatsUrl;

  const poolsStats: Record<string, number | string>[] = (
    await axios.get(poolsStatsUrl)
  )?.data?.data;

  return poolsStats;
};

const getBlockDistributions = async (latestBlockFoundTime: number) => {
  let blockDistributionUrl =
    MONERO_MINING_BLOCK_DISTRIBUTION_URL(latestBlockFoundTime);
  blockDistributionUrl = isClient
    ? proxyUrl(blockDistributionUrl)
    : blockDistributionUrl;

  const blockDistributions: MoneroBlockDistribution = (
    await axios.get(blockDistributionUrl)
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

const getMiningStats = async (): Promise<MiningStats> => {
  let url = isClient
    ? proxyUrl(QUBIC_XMR_STATS_API_URL)
    : QUBIC_XMR_STATS_API_URL;
  try {
    let {
      pool_hashrate,
      network_hashrate,
      connected_miners,
      last_block_found,
      pool_blocks_found,
    } = (await axios.get(url)).data;

    let latestBlockFoundTimeUrl = MONERO_MINING_LATEST_BLOCK_FOUND_URL();
    latestBlockFoundTimeUrl = isClient
      ? proxyUrl(latestBlockFoundTimeUrl)
      : latestBlockFoundTimeUrl;
    const latestBlockFoundTime: number = (
      await axios.get(latestBlockFoundTimeUrl)
    )?.data;

    const poolsStats = await getMiningPoolsStats(latestBlockFoundTime);

    const hashrateAverages = getHashrateAverages(poolsStats);

    const hashrateRanking = getRankingByHashrate(poolsStats, pool_hashrate);

    const monero_block_distributions =
      await getBlockDistributions(latestBlockFoundTime);

    const miningStats: MiningStats = {
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
    return miningStats;
  } catch (error) {
    if (!isClient) {
      console.log("Error mining stats: ", error);
    }
    return null;
  }
};

export default getMiningStats;
