import groupBy from "lodash/groupBy";

import type { XTMHistoryCharts, XTMMiningHistory } from "@/types/MiningStats";
import axios from "axios";
import {
  QUBIC_LIVE_STATS_URL,
  SAFE_TRADE_KLINES_URL,
  SafeTradePeriod,
} from "./constants";
import { roundToHundreds } from "./numbers";

export const calculateTotalXTM = (history: XTMMiningHistory["blocks"]) => {
  return Math.trunc(history.reduce((total, item) => total + item.reward, 0));
};

const getSafeTradeXTMPrice = async (
  args: {
    period: SafeTradePeriod;
    time_from: number;
    time_to: number;
    limit: number;
  }[],
) => {
  const apis = [];
  args.forEach(({ period, time_from, time_to, limit }) => {
    apis.push(
      fetch(
        SAFE_TRADE_KLINES_URL("xtmusdt", period, time_from, time_to, limit),
      ),
    );
  });
  const response = await Promise.all(apis);
  const prices = [];
  for await (const data of response) {
    const price = await data.json();
    prices.push(price[0][4]);
  }
  return prices;
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

  const safeTradeArgs = [];

  let epochAtTheStart = 161;
  let weeklyXtmChartHistory =
    [] as unknown as XTMHistoryCharts["blocks_found_chart"]["weekly"];

  const entriesByStartTimestamp =
    Object.entries<XTMMiningHistory["blocks"]>(grouped);
  const maxLengthEntriesByStartTimestamp = entriesByStartTimestamp.length;
  for (let i = 0; i < maxLengthEntriesByStartTimestamp; i++) {
    let [, subArr] = entriesByStartTimestamp[i];

    let time_from = 0,
      time_to = 0;
    if (i + 1 === maxLengthEntriesByStartTimestamp) {
      time_to = Math.trunc(new Date().getTime() / 1000);
    } else {
      time_to = Math.trunc(
        new Date(entriesByStartTimestamp[i + 1][0]).getTime() / 1000,
      );
    }
    time_from = time_to - 3_600;

    const weekHistory: XTMHistoryCharts["blocks_found_chart"]["weekly"][0] = {
      epoch: epochAtTheStart++,
      reward: calculateTotalXTM(subArr),
      blocks_found: subArr.length,
      total_usdt: 0,
    };
    weeklyXtmChartHistory.push(weekHistory);

    safeTradeArgs.push({
      period: SafeTradePeriod.ONE_HOUR,
      time_from,
      time_to,
      limit: 1,
    });
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
      total_usdt: 0,
    });
  }

  const safeTradeXTMPrices = await getSafeTradeXTMPrice(safeTradeArgs);

  const chartLength = weeklyXtmChartHistory.length;
  for (let i = 0; i < chartLength; i++) {
    const chart = weeklyXtmChartHistory[i];
    chart.total_usdt = roundToHundreds(
      Math.trunc(safeTradeXTMPrices[i] * chart.reward),
    );
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
