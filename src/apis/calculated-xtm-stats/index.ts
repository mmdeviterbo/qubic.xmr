import type { NextApiRequest, NextApiResponse } from "next";

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

const getTariMiningStats = async (): Promise<XTMHistoryCharts> => {
  try {
    let xtmHistory = await getXtmBlocksHistory();

    const { blocks_found_chart } = await getXtmChartHistory(xtmHistory.blocks);

    const pool_blocks_found = xtmHistory.total_found;
    const last_block_found = xtmHistory.blocks.at(-1).timestamp.concat("Z");
    const total_rewards = calculateTotalXTM(xtmHistory.blocks);

    return {
      tari_blocks_found: {
        total_rewards,
        pool_blocks_found,
        last_block_found,
      },
      blocks_found_chart,
    };
  } catch (error) {}
};

export default getTariMiningStats;
