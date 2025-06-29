import axios from "axios";

import isEmpty from "lodash/isEmpty";
import groupBy from "lodash/groupBy";

import type {
  AdvanceMiningCharts,
  AdvanceMiningStatsResponse,
  DailyChart,
  WeeklyChart,
} from "@/types/MiningStats";
import {
  blockToXMRConversion,
  isClient,
  MEXC_KLINES_URL,
  MEXCInterval,
  proxyUrl,
  QUBIC_RAILWAY_SERVER_ADVANCE_MINING_STATS,
} from "@/utils/constants";
import { PRICES } from "@/utils/checkpoints.json";
import { roundToHundreds } from "@/utils/numbers";

export const getMEXCXMRPrice = async (
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

export const getDailyXMRBlocks = async (
  data: AdvanceMiningStatsResponse["blocks"],
): Promise<DailyChart[]> => {
  const daily: DailyChart[] = [];
  const dataCount = data.length;
  for (let i = 0; i < dataCount; i++) {
    const previousBlocksFound = i > 0 ? data[i - 1].blocks_found : 0;
    const { timestamp, epoch, blocks_found: currentBlocksFound } = data[i];
    const blocksFound = currentBlocksFound - previousBlocksFound;
    daily.push({
      timestamp: timestamp.split("T")[0],
      blocks_found: blocksFound,
      reward: blocksFound * blockToXMRConversion,
      epoch,
    });
  }
  return daily;
};

export const getWeeklyXMRBlocks = async (
  data: DailyChart[],
): Promise<WeeklyChart[]> => {
  const groupedByEpoch = groupBy(data, "epoch");

  let endOfEpoch161 = new Date("2025-05-21T12:00:00.000Z");

  const weekly: WeeklyChart[] = [];
  const mexcXMRArgs = [];

  const groupedEntries = Object.entries(groupedByEpoch);
  const maxGroupedEntriesCount = groupedEntries.length;
  for (let i = 0; i < maxGroupedEntriesCount; i++) {
    const [epoch, epochBlocks] = groupedEntries[i];
    const totalBlocks = epochBlocks.reduce(
      (accumulator, currentValue) => accumulator + currentValue.blocks_found,
      0,
    );
    weekly.push({
      blocks_found: totalBlocks,
      total_usdt: 0,
      reward: totalBlocks * blockToXMRConversion,
      epoch: Number(epoch),
    });

    const startTime = endOfEpoch161.getTime();
    if (i + 1 === maxGroupedEntriesCount) {
      const startTime = new Date().getTime();
      mexcXMRArgs.push({
        startTime: startTime - 3600000,
        endTime: startTime,
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
    endOfEpoch161.setUTCDate(endOfEpoch161.getUTCDate() + 7);
  }

  const mexcXMRPrices = await getMEXCXMRPrice(mexcXMRArgs);
  const weeklyLength = weekly.length;
  for (let i = 0; i < weeklyLength; i++) {
    const weeklyChart = weekly[i];
    weeklyChart.total_usdt = roundToHundreds(
      Math.trunc((mexcXMRPrices[i] ?? 0) * weeklyChart.reward),
    );
  }

  return weekly;
};

export const getAdvanceMiningStats = async (): Promise<AdvanceMiningCharts> => {
  const { data, status } = await axios.get<AdvanceMiningStatsResponse>(
    QUBIC_RAILWAY_SERVER_ADVANCE_MINING_STATS,
  );
  if (status === 200) {
    const transformedData = await transformAdvanceMiningStats(data);
    return transformedData;
  }
  return null;
};

export const transformAdvanceMiningStats = async (
  data: AdvanceMiningStatsResponse,
): Promise<AdvanceMiningCharts> => {
  let daily: DailyChart[] = [],
    weekly: WeeklyChart[] = [];
  if (!isEmpty(data?.blocks)) {
    daily = await getDailyXMRBlocks(data?.blocks);
    weekly = await getWeeklyXMRBlocks(daily);
  }

  const hashratesChart: AdvanceMiningCharts["hashratesChart"] = [];
  if (!isEmpty(data?.hashrates)) {
    data?.hashrates.forEach((d) => {
      hashratesChart.push({
        epoch: Number(d.epoch),
        max_hashrate: Number(d.max_hashrate),
        timestamp: d.timestamp,
      });
    });
  }

  return { blocksChart: { daily, weekly }, hashratesChart };
};
