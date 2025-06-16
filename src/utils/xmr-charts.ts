import axios from "axios";
import maxBy from "lodash/maxBy";
import type { XMRHistoryCharts, XMRMiningHistory } from "@/types/MiningStats";
import { roundToHundreds } from "./numbers";
import {
  blockToXMRConversion,
  MEXC_KLINES_URL,
  MEXCInterval,
} from "./constants";

const getMEXCXMRPrice = async (
  args: {
    interval: MEXCInterval;
    startTime: number;
    endTime?: number;
  }[],
) => {
  const apis = [];
  args.forEach(({ startTime, endTime, interval }) => {
    apis.push(
      axios.get(MEXC_KLINES_URL("XMRUSDT", interval, startTime, endTime)),
    );
  });
  const prices = await Promise.all(apis);
  return prices?.map((p) => p.data[0][4]);
};

const getBlocksFoundByStartIndexAndEndIndex = (
  startIndex: number,
  endIndex: number,
  history: XMRMiningHistory[],
): number => {
  if (!startIndex) {
    return Number(history[endIndex].pool_blocks_found);
  }

  return (
    Number(history[endIndex].pool_blocks_found) -
    Number(history[startIndex].pool_blocks_found) +
    (Number(history[startIndex].pool_blocks_found) -
      Number(history[startIndex - 1].pool_blocks_found))
  );
};

const getDailyBlocksFound = (
  dailyHistory: XMRMiningHistory[],
  history: XMRMiningHistory[],
): XMRHistoryCharts["blocks_found_chart"]["daily"] => {
  let charts = [] as unknown as XMRHistoryCharts["blocks_found_chart"]["daily"];
  const maxDailyHistoryLength = dailyHistory.length;
  for (let i = 0; i < maxDailyHistoryLength; i++) {
    const startIndex = dailyHistory[i - 1]?.index;
    const endIndex = dailyHistory[i].index;

    const blocks_found = getBlocksFoundByStartIndexAndEndIndex(
      startIndex,
      endIndex,
      history,
    );
    charts.push({
      timestamp: history.at(endIndex).timestamp.split(" ")[0],
      blocks_found,
      reward: blocks_found * blockToXMRConversion,
    });
  }
  return charts;
};

const getWeeklyBlocksFound = async (
  weeklyHistory: XMRMiningHistory[],
  history: XMRMiningHistory[],
): Promise<XMRHistoryCharts["blocks_found_chart"]["weekly"]> => {
  let charts =
    [] as unknown as XMRHistoryCharts["blocks_found_chart"]["weekly"];

  const maxWeeklyHistoryLength = weeklyHistory.length;

  const mexcXMRArgs = [];

  for (let i = 0; i < maxWeeklyHistoryLength; i++) {
    const startIndex = weeklyHistory[i - 1]?.index;
    const endIndex = weeklyHistory[i].index;

    const blocks_found = getBlocksFoundByStartIndexAndEndIndex(
      startIndex,
      endIndex,
      history,
    );

    const startTime = new Date(
      weeklyHistory[i].timestamp.concat("Z"),
    ).getTime();
    const isLastItem = maxWeeklyHistoryLength === i + 1;
    mexcXMRArgs.push({
      startTime: isLastItem ? startTime - 3600000 : startTime,
      endTime: isLastItem ? startTime : startTime + 3600000,
      interval: MEXCInterval.ONE_HOUR,
      symbol: "XMRUSDT",
    });

    charts.push({
      blocks_found,
      epoch: Number(history.at(endIndex).qubic_epoch),
      reward: blocks_found * blockToXMRConversion,
      total_usdt: 0,
    });
  }

  const mexcXMRPrices = await getMEXCXMRPrice(mexcXMRArgs);
  const chartLength = charts.length;
  for (let i = 0; i < chartLength; i++) {
    const chart = charts[i];
    chart.total_usdt = roundToHundreds(
      Math.trunc(mexcXMRPrices[i] * chart.reward),
    );
  }

  return charts;
};

const getMaxHashratesPerEpoch = (
  weeklyHistory: XMRMiningHistory[],
  history: XMRMiningHistory[],
): XMRHistoryCharts["max_hashrates_chart"] => {
  let charts = [] as unknown as XMRHistoryCharts["max_hashrates_chart"];

  const maxWeeklyHistoryLength = weeklyHistory.length;
  for (let i = 0; i < maxWeeklyHistoryLength; i++) {
    const startIndex = weeklyHistory[i - 1]?.index ?? 0;
    const endIndex = weeklyHistory[i].index;
    const maxHashratePerEpoch = maxBy(
      history.slice(startIndex, endIndex),
      (i) => Number(i.pool_hashrate),
    );
    charts.push({
      max_hashrate: Number(maxHashratePerEpoch.pool_hashrate),
      epoch: Number(history.at(endIndex).qubic_epoch),
    });
  }
  return charts;
};

const getXmrWeeklyIndeces = (history: XMRMiningHistory[]): number[] => {
  const weekMap = {}; // weekKey -> { index, timestamp }

  history.forEach((item, index) => {
    const timestamp = new Date(item.timestamp.concat("Z"));

    // Get the start of the ISO week (Monday)
    const day = timestamp.getUTCDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
    const diffToMonday = (day + 6) % 7; // days to subtract to reach Monday
    const monday = new Date(
      Date.UTC(
        timestamp.getUTCFullYear(),
        timestamp.getUTCMonth(),
        timestamp.getUTCDate() - diffToMonday,
        0,
        0,
        0,
        0,
      ),
    );

    // Get Wednesday 12:00 UTC of that week
    const wednesdayNoon = new Date(monday);
    wednesdayNoon.setUTCDate(monday.getUTCDate() + 2); // Wednesday
    wednesdayNoon.setUTCHours(12, 0, 0, 0);

    const weekKey = `${monday.getUTCFullYear()}-${monday.getUTCMonth()}-${monday.getUTCDate()}`;

    if (timestamp < wednesdayNoon) {
      const currentBest = weekMap[weekKey];

      // Keep only the one closest to Wednesday 12:00 UTC
      if (
        !currentBest ||
        new Date(history[currentBest.index].timestamp) < timestamp
      ) {
        weekMap[weekKey] = { index, timestamp };
      }
    }
  });

  const weeklyIndeces: number[] = Object.values(weekMap).map(
    (entry) => (entry as any).index,
  );
  if (weeklyIndeces.at(-1) !== history.length - 1) {
    weeklyIndeces.push(history.length - 1);
  }
  return weeklyIndeces;
};

const getXmrDailyIndeces = (history: XMRMiningHistory[]): number[] => {
  const seenDaily = new Set();
  const indicesDaily = [];

  const maxLength = history.length - 1;
  for (let i = maxLength; i >= 0; i--) {
    const ts = history[i]?.timestamp;
    const date = new Date(ts.concat("Z"));
    const utcDateStr = date.toISOString().split("T")[0]; // 'YYYY-MM-DD'

    const hours = date.getUTCHours();

    const isBeforeDayEnds = hours < 24;
    if (!seenDaily.has(utcDateStr) && isBeforeDayEnds) {
      seenDaily.add(utcDateStr);
      indicesDaily.push(i);
    }
  }
  const sortedIndecesDaily = indicesDaily.reverse();
  return sortedIndecesDaily;
};

export const getChartHistory = async (
  history: XMRMiningHistory[],
): Promise<XMRHistoryCharts> => {
  const historyWithIndexWeekly = getXmrWeeklyIndeces(history).map((i) => ({
    ...history[i],
    index: i,
  }));
  const weekly = await getWeeklyBlocksFound(historyWithIndexWeekly, history);

  const historyWithIndexDaily: XMRMiningHistory[] = getXmrDailyIndeces(
    history,
  ).map((i) => ({ ...history[i], index: i }));
  const daily = getDailyBlocksFound(historyWithIndexDaily, history);

  const max_hashrates_chart = getMaxHashratesPerEpoch(
    historyWithIndexWeekly,
    history,
  );

  return {
    blocks_found_chart: {
      weekly,
      daily,
    },
    max_hashrates_chart,
  };
};
