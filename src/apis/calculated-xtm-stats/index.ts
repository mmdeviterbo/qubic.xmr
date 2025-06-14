import axios from "axios";

import { TARI_BLOCKS_HISTORY_API_URL } from "@/utils/constants";
import type { XTMHistoryCharts, XTMMiningHistory } from "@/types/MiningStats";
import { calculateTotalXTM, getXtmChartHistory } from "@/utils/xtm-charts";

const getXtmBlocksHistory = async (): Promise<XTMMiningHistory> => {
  const { data, status } = await axios.get<XTMMiningHistory>(
    TARI_BLOCKS_HISTORY_API_URL,
  );
  return status === 200 ? data : null;
};

const getBlockDistributions = (xtmHistory: XTMMiningHistory) => {
  const latestBlock = xtmHistory.last_scanned_height;
  const startOf100Blocks = latestBlock - 99;
  const startOf1000Blocks = latestBlock - 999;

  let count100Blocks = 0;
  for (let i = latestBlock; i >= startOf100Blocks; i--) {
    const isExist = xtmHistory.blocks.find((b) => b.block_height === i);
    if (isExist) {
      count100Blocks++;
    }
  }

  let count1000Blocks = count100Blocks;
  for (let i = startOf100Blocks - 1; i >= startOf1000Blocks; i--) {
    const isExist = xtmHistory.blocks.find((b) => b.block_height === i);
    if (isExist) {
      count1000Blocks++;
    }
  }

  return {
    last100Blocks: count100Blocks,
    last1000Blocks: count1000Blocks,
  };
};

const getTariMiningStats = async (): Promise<XTMHistoryCharts> => {
  try {
    let xtmHistory = await getXtmBlocksHistory();

    const { blocks_found_chart } = await getXtmChartHistory(xtmHistory.blocks);

    const pool_blocks_found = xtmHistory.total_found;
    const last_block_found = xtmHistory.blocks.at(-1).timestamp.concat("Z");
    const total_rewards = calculateTotalXTM(xtmHistory.blocks);
    const tari_block_distributions = getBlockDistributions(xtmHistory);

    return {
      tari_blocks_found: {
        total_rewards,
        pool_blocks_found,
        last_block_found,
      },
      blocks_found_chart,
      tari_block_distributions,
    };
  } catch (error) {
    console.log("/api/calculated-xtm-stats: ", error);
  }
};

export default getTariMiningStats;
