import axios from "axios";

import { PRICES } from "@/utils/checkpoints.json";
import type { XTMHistoryCharts, XTMMiningHistory } from "@/types/MiningStats";
import { roundToHundreds } from "./numbers";
import {
  QUBIC_LIVE_STATS_URL,
  SAFE_TRADE_KLINES_URL,
  SafeTradePeriod,
} from "./constants";

export const calculateTotalXTM = (history: XTMMiningHistory["blocks"]) => {
  return Math.trunc(history.reduce((total, item) => total + item.reward, 0));
};

const getSafeTradeXTMPrice = async (
  args: {
    period: SafeTradePeriod;
    time_from: number;
    time_to: number;
    limit: number;
    epoch: number;
  }[],
) => {
  const prices = [];

  const apis = [];
  args.forEach(({ period, time_from, time_to, limit, epoch }) => {
    const existingPrice = PRICES.XTM.find((t) => t.epoch === epoch)?.price;
    if (existingPrice) {
      prices.push(existingPrice);
    } else {
      apis.push(
        fetch(
          SAFE_TRADE_KLINES_URL("xtmusdt", period, time_from, time_to, limit),
        ),
      );
    }
  });

  const response = await Promise.all(apis);
  for await (const data of response) {
    const price = await data.json();
    prices.push(price[0][4]);
  }
  return prices;
};

function getLatestNoonUTC() {
  const now = new Date();

  const utcYear = now.getUTCFullYear();
  const utcMonth = now.getUTCMonth();
  const utcDate = now.getUTCDate();

  // Create today's 12:00 UTC
  const noonUTC = new Date(Date.UTC(utcYear, utcMonth, utcDate, 12, 0, 0));

  // If now is after or exactly 12:00 UTC, return today's noon
  if (now >= noonUTC) {
    return noonUTC;
  }

  // Otherwise, return yesterday's noon
  return new Date(noonUTC.getTime() - 24 * 60 * 60 * 1000);
}

const getXtmDailyChartHistory = (
  blocks: XTMMiningHistory["blocks"],
): XTMHistoryCharts["blocks_found_chart"]["daily"] => {
  const groupsArray: Record<string, XTMMiningHistory["blocks"]> = {};

  const blocksCount = blocks.length;

  const oneDayInMilliseconds = 86400000;
  let startTime = new Date("2025-05-19 12:00:00Z").getTime();
  let endTime = startTime + oneDayInMilliseconds;

  const todayTime = getLatestNoonUTC().getTime();
  let savedIndex = 0;

  while (todayTime >= startTime) {
    const subArray: XTMMiningHistory["blocks"] = [];
    for (let i = savedIndex; i < blocksCount; i++) {
      const date = new Date(blocks[i].timestamp.concat("Z")).getTime();
      if (date >= startTime && date < endTime) {
        subArray.push(blocks[i]);
        savedIndex = i + 1;
      } else {
        break;
      }
    }
    groupsArray[new Date(startTime).toISOString().split("T")[0]] = subArray;
    startTime = startTime + oneDayInMilliseconds;
    endTime = endTime + oneDayInMilliseconds;
  }

  const dailyHistory: XTMHistoryCharts["blocks_found_chart"]["daily"] = [];
  for (const entry of Object.entries(groupsArray)) {
    const [dateKey, blocks] = entry;
    dailyHistory.push({
      timestamp: dateKey,
      reward: calculateTotalXTM(blocks),
      blocks_found: blocks.length,
    });
  }
  return dailyHistory;
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
      epoch: epochAtTheStart,
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
      epoch: epochAtTheStart++,
    });
  }

  //Handle if latest block is still from previous epoch
  const latestBlockFoundEpoch = weeklyXtmChartHistory.at(-1).epoch;
  const currentEpoch = (await axios.get(QUBIC_LIVE_STATS_URL))?.data?.data
    ?.epoch;

  if (latestBlockFoundEpoch !== currentEpoch) {
    weeklyXtmChartHistory.push({
      epoch: currentEpoch,
      reward: 0,
      blocks_found: 0,
      total_usdt: 0,
    });
  }

  const safeTradeXTMPrices = await getSafeTradeXTMPrice(safeTradeArgs);

  const chartLength = weeklyXtmChartHistory.length;
  for (let i = 0; i < chartLength; i++) {
    const chart = weeklyXtmChartHistory[i];
    chart.total_usdt = roundToHundreds(
      Math.trunc((safeTradeXTMPrices[i] ?? 0) * chart.reward),
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
