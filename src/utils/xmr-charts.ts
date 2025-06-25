import axios from "axios";
import maxBy from "lodash/maxBy";

import { PRICES } from "@/utils/checkpoints.json";
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
    epoch: number;
  }[],
) => {
  const prices = [];
  const apis = [];
  args.forEach(({ startTime, endTime, interval, epoch }) => {
    const existingPrice = PRICES.XMR.find((t) => t.epoch === epoch)?.price;
    if (existingPrice) {
      prices.push(existingPrice);
    } else {
      apis.push(
        axios.get(MEXC_KLINES_URL("XMRUSDT", interval, startTime, endTime)),
      );
    }
  });

  const responsePrices = await Promise.all(apis);
  responsePrices?.forEach((p) => prices.push(Number(p.data[0][4])));
  return prices;
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
    const startIndex = dailyHistory[i]?.index;
    const endIndex =
      i + 1 !== maxDailyHistoryLength
        ? dailyHistory[i + 1].index
        : history.length - 1;

    const blocks_found = getBlocksFoundByStartIndexAndEndIndex(
      startIndex,
      endIndex,
      history,
    );
    charts.push({
      timestamp: history.at(startIndex).timestamp.split(" ")[0],
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
    const epoch = Number(history.at(endIndex).qubic_epoch);

    const isLastItem = maxWeeklyHistoryLength === i + 1;
    mexcXMRArgs.push({
      startTime: isLastItem ? startTime - 3600000 : startTime,
      endTime: isLastItem ? startTime : startTime + 3600000,
      interval: MEXCInterval.ONE_HOUR,
      symbol: "XMRUSDT",
      epoch,
    });

    charts.push({
      blocks_found,
      epoch,
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

    const previousEndIndex =
      i - 1 >= 0 ? weeklyHistory[i - 1]?.index : weeklyHistory[i]?.index;
    const epoch =
      history.at(endIndex).qubic_epoch !== "0"
        ? Number(history.at(endIndex).qubic_epoch)
        : Number(history.at(previousEndIndex).qubic_epoch) + 1;

    charts.push({
      max_hashrate: Number(maxHashratePerEpoch.pool_hashrate),
      epoch: epoch,
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

function getXmrDailyIndeces(history: XMRMiningHistory[]): number[] {
  const seenDays = new Set();
  const result = [];

  for (let i = 0; i < history.length; i++) {
    const ts = new Date(history[i].timestamp.concat("Z"));

    // Build that day's 12:00 UTC
    const noonUTC = new Date(
      Date.UTC(
        ts.getUTCFullYear(),
        ts.getUTCMonth(),
        ts.getUTCDate(),
        12,
        0,
        0,
      ),
    );

    // Check if the timestamp is >= that day's noon
    if (ts >= noonUTC) {
      const dayKey = noonUTC.toISOString().slice(0, 10); // 'YYYY-MM-DD'

      if (!seenDays.has(dayKey)) {
        seenDays.add(dayKey);
        result.push(i);
      }
    }
  }
  return result;
}

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
