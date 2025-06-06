import type { HistoryCharts, QubicMiningHistory } from "@/types/MiningStats";
import maxBy from "lodash/maxBy";

const getBlocksFoundByStartIndexAndEndIndex = (
  startIndex: number,
  endIndex: number,
  history: QubicMiningHistory[],
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
  dailyHistory: QubicMiningHistory[],
  history: QubicMiningHistory[],
): HistoryCharts["blocks_found_chart"]["daily"] => {
  let charts = [] as unknown as HistoryCharts["blocks_found_chart"]["daily"];
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
    });
  }
  return charts;
};

const getWeeklyBlocksFound = (
  weeklyHistory: QubicMiningHistory[],
  history: QubicMiningHistory[],
): HistoryCharts["blocks_found_chart"]["weekly"] => {
  let charts = [] as unknown as HistoryCharts["blocks_found_chart"]["weekly"];

  const maxWeeklyHistoryLength = weeklyHistory.length;
  for (let i = 0; i < maxWeeklyHistoryLength; i++) {
    const startIndex = weeklyHistory[i - 1]?.index;
    const endIndex = weeklyHistory[i].index;

    const blocks_found = getBlocksFoundByStartIndexAndEndIndex(
      startIndex,
      endIndex,
      history,
    );
    charts.push({
      blocks_found,
      epoch: Number(history.at(endIndex).qubic_epoch),
    });
  }
  return charts;
};

const getMaxHashratesPerEpoch = (
  weeklyHistory: QubicMiningHistory[],
  history: QubicMiningHistory[],
): HistoryCharts["max_hashrates_chart"] => {
  let charts = [] as unknown as HistoryCharts["max_hashrates_chart"];

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

export const getChartHistory = (
  history: QubicMiningHistory[],
): HistoryCharts => {
  const seenDaily = new Set();
  const indicesDaily = [];

  const seenWeekly = new Set();
  const indicesWeekly = [];

  const maxLength = history.length - 1;
  for (let i = maxLength - 1; i >= 0; i--) {
    const ts = history[i]?.timestamp;
    const date = new Date(ts.concat("Z"));
    const utcDateStr = date.toISOString().split("T")[0]; // 'YYYY-MM-DD'

    const days = date.getUTCDay();
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();

    const isBeforeDayEnds = hours < 24;
    if (!seenDaily.has(utcDateStr) && isBeforeDayEnds) {
      seenDaily.add(utcDateStr);
      indicesDaily.push(i);
    }

    const isBeforeWednesdayNoon =
      days === 3 && hours < 12 && minutes <= 59 && seconds <= 59;
    if (!seenWeekly.has(utcDateStr) && isBeforeWednesdayNoon) {
      seenWeekly.add(utcDateStr);
      indicesWeekly.push(i);
    }
  }

  const sortedIndecesDaily = indicesDaily.reverse();
  const historyWithIndexDaily: QubicMiningHistory[] = sortedIndecesDaily.map(
    (i) => ({ ...history[i], index: i }),
  );

  const sortedIndecesWeekly = indicesWeekly.reverse();
  const historyWithIndexWeekly: QubicMiningHistory[] = sortedIndecesWeekly.map(
    (i) => ({ ...history[i], index: i }),
  );
  historyWithIndexWeekly.push({ ...history.at(-1), index: maxLength });

  const blocks_found_chart: HistoryCharts["blocks_found_chart"] = {
    daily: getDailyBlocksFound(historyWithIndexDaily, history),
    weekly: getWeeklyBlocksFound(historyWithIndexWeekly, history),
  };

  const max_hashrates_chart = getMaxHashratesPerEpoch(
    historyWithIndexWeekly,
    history,
  );

  return {
    blocks_found_chart,
    max_hashrates_chart,
  };
};
