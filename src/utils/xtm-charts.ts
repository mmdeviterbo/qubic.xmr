import groupBy from "lodash/groupBy";

import type { XTMHistoryCharts, XTMMiningHistory } from "@/types/MiningStats";
import axios from "axios";
import { QUBIC_LIVE_STATS_URL } from "./constants";

export const calculateTotalXTM = (history: XTMMiningHistory["blocks"]) => {
  return Math.trunc(history.reduce((total, item) => total + item.reward, 0));
};

const getXtmDailyChartHistory = (
  blocks: XTMMiningHistory["blocks"],
): XTMHistoryCharts["blocks_found_chart"]["daily"] => {
  const groupedBasedOnDate = groupBy(blocks, (i) => i.timestamp.split(" ")[0]);

  const daily_history: XTMHistoryCharts["blocks_found_chart"]["daily"] = [];
  for (const groupedDailyBlock of Object.entries(groupedBasedOnDate)) {
    const [timestamp, daily_blocks] = groupedDailyBlock;
    daily_history.push({
      timestamp,
      blocks_found: daily_blocks.length,
      reward: calculateTotalXTM(daily_blocks),
    });
  }

  //Handle if latest block is still from yesterday's
  const todayInUTC = new Date().toISOString().split("T")[0];
  const latestBlockFound = daily_history.at(-1).timestamp;
  if (todayInUTC !== latestBlockFound) {
    daily_history.push({
      blocks_found: 0,
      reward: 0,
      timestamp: todayInUTC,
    });
  }

  return daily_history;
};

const getXtmWeeklyChartHistory = async (
  blocks: XTMMiningHistory["blocks"],
): Promise<XTMHistoryCharts["blocks_found_chart"]["weekly"]> => {
  const getWeekStart = (timestamp: string) => {
    const date = new Date(timestamp.concat("Z"));
    const day = date.getUTCDay(); // 0 (Sun) - 6 (Sat)
    const hours = date.getUTCHours();

    let daysSinceWednesday = (7 + day - 3) % 7;
    if (daysSinceWednesday === 0 && hours < 12) {
      daysSinceWednesday = 7;
    }

    date.setUTCDate(date.getUTCDate() - daysSinceWednesday);
    date.setUTCHours(12, 0, 0, 0); // Set to 12:00 UTC

    return date.toISOString(); // Use this as a grouping key
  };

  const grouped = {};
  blocks.forEach((block) => {
    const weekStart = getWeekStart(block.timestamp);
    if (!grouped[weekStart]) {
      grouped[weekStart] = [];
    }
    grouped[weekStart].push(block);
  });

  let epochAtTheStart = 161;
  const groupedArray = Object.values(grouped) as XTMMiningHistory["blocks"][];
  let weeklyXtmChartHistory =
    [] as unknown as XTMHistoryCharts["blocks_found_chart"]["weekly"];
  for (const subArr of groupedArray) {
    const weekHistory: XTMHistoryCharts["blocks_found_chart"]["weekly"][0] = {
      epoch: epochAtTheStart++,
      reward: calculateTotalXTM(subArr),
      blocks_found: subArr.length,
    };
    weeklyXtmChartHistory.push(weekHistory);
  }

  //Handle if latest block is still from previous epoch
  const latestBlockFound = weeklyXtmChartHistory.at(-1).epoch;
  const currentEpoch = (await axios.get(QUBIC_LIVE_STATS_URL))?.data?.data
    ?.epoch;

  if (latestBlockFound !== currentEpoch) {
    weeklyXtmChartHistory.push({
      blocks_found: 0,
      epoch: currentEpoch,
      reward: 0,
    });
  }

  return weeklyXtmChartHistory;
};

export const getXtmChartHistory = async (
  blocks: XTMMiningHistory["blocks"],
): Promise<Pick<XTMHistoryCharts, "blocks_found_chart">> => {
  blocks.reverse();

  const daily = getXtmDailyChartHistory(blocks);
  const weekly = await getXtmWeeklyChartHistory(blocks);

  return {
    blocks_found_chart: { daily, weekly },
  };
};
