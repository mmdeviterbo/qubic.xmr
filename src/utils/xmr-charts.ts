import axios from "axios";
import maxBy from "lodash/maxBy";

import { PRICES, MAX_HASHRATES } from "@/utils/checkpoints.json";
import type { XMRHistoryCharts, XMRMiningHistory } from "@/types/MiningStats";
import { roundToHundreds } from "./numbers";
import {
  blockToXMRConversion,
  isClient,
  MEXC_KLINES_URL,
  MEXCInterval,
  proxyUrl,
} from "./constants";

const epoch_mining_start = 161;

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
      let mexcKLinesUrl = MEXC_KLINES_URL(
        "XMRUSDT",
        interval,
        startTime,
        endTime,
      );
      mexcKLinesUrl = isClient
        ? proxyUrl(encodeURIComponent(mexcKLinesUrl))
        : mexcKLinesUrl;
      apis.push(axios.get(mexcKLinesUrl));
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
      epoch: Number(history.at(startIndex).qubic_epoch),
      reward: blocks_found * blockToXMRConversion,
    });
  }
  return charts;
};

const getWeeklyBlocksFound = async (
  weeklyHistory: XMRMiningHistory[],
  history: XMRMiningHistory[],
  pool_blocks_found: number,
): Promise<XMRHistoryCharts["blocks_found_chart"]["weekly"]> => {
  let charts =
    [] as unknown as XMRHistoryCharts["blocks_found_chart"]["weekly"];

  const maxWeeklyHistoryLength = weeklyHistory.length;
  const mexcXMRArgs = [];

  let epoch = epoch_mining_start;

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
    if (isLastItem) {
      let lastItemStartTime = new Date().getTime();
      mexcXMRArgs.push({
        startTime: lastItemStartTime - 3600000,
        endTime: lastItemStartTime,
        interval: MEXCInterval.ONE_HOUR,
        symbol: "XMRUSDT",
        epoch: epoch,
      });
    } else {
      mexcXMRArgs.push({
        startTime: startTime,
        endTime: startTime + 3600000,
        interval: MEXCInterval.ONE_HOUR,
        symbol: "XMRUSDT",
        epoch: epoch,
      });
    }

    if (isLastItem) {
      let previousTotalBlocks = charts.reduce(
        (accumulator, currentValue) => accumulator + currentValue.blocks_found,
        0,
      );
      const currentBlocksFound = pool_blocks_found - previousTotalBlocks;
      charts.push({
        blocks_found: currentBlocksFound,
        epoch: epoch++,
        reward: currentBlocksFound * blockToXMRConversion,
        total_usdt: 0,
      });
    } else {
      charts.push({
        blocks_found,
        epoch: epoch++,
        reward: blocks_found * blockToXMRConversion,
        total_usdt: 0,
      });
    }
  }

  const mexcXMRPrices = await getMEXCXMRPrice(mexcXMRArgs);

  const chartLength = charts.length;
  for (let i = 0; i < chartLength; i++) {
    const chart = charts[i];
    chart.total_usdt = roundToHundreds(
      Math.trunc((mexcXMRPrices[i] ?? 0) * chart.reward),
    );
  }

  return charts;
};

const getMaxHashratesPerEpoch = (
  weeklyHistory: XMRMiningHistory[],
  history: XMRMiningHistory[],
): XMRHistoryCharts["max_hashrates_chart"] => {
  let charts = [] as unknown as XMRHistoryCharts["max_hashrates_chart"];

  let epoch = epoch_mining_start;

  const maxWeeklyHistoryLength = weeklyHistory.length;
  for (let i = 0; i < maxWeeklyHistoryLength; i++) {
    const isEpochExist = MAX_HASHRATES.find((m) => m.epoch === epoch);
    if (isEpochExist) {
      charts.push({
        max_hashrate: Number(isEpochExist.max_hashrate),
        epoch: epoch++,
      });
      continue;
    }

    const startIndex = weeklyHistory[i - 1]?.index ?? 0;
    const endIndex = weeklyHistory[i].index;
    const maxHashratePerEpoch = maxBy(
      history.slice(startIndex, endIndex),
      (i) => Number(i.pool_hashrate),
    );

    charts.push({
      max_hashrate: Number(maxHashratePerEpoch.pool_hashrate),
      epoch: epoch++,
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
  pool_blocks_found: number,
): Promise<XMRHistoryCharts> => {
  history = history.at(-1).timestamp === "" ? history.slice(0, -1) : history;

  const historyWithIndexWeekly = getXmrWeeklyIndeces(history).map((i) => ({
    ...history[i],
    index: i,
  }));
  const weekly = await getWeeklyBlocksFound(
    historyWithIndexWeekly,
    history,
    pool_blocks_found,
  );

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
