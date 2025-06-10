import type { XTMHistoryCharts, XTMMiningHistory } from "@/types/MiningStats";

export const calculateTotalXTM = (history: XTMMiningHistory[]) => {
  return history.reduce((total, item) => total + item.reward, 0);
};

const getXtmDailyChartHistory = (
  history: XTMMiningHistory[],
): XTMHistoryCharts["blocks_found_chart"]["daily"] => {
  if (!history?.length) {
    return null;
  }

  const groupedData = [] as unknown as XTMMiningHistory[][];

  let currentDailyGroup = [] as unknown as XTMMiningHistory[];
  let currentDailyTimeframeStartMs = null;

  history.forEach((item) => {
    const itemTimestamp = new Date(item.timestamp);

    const startOfItemUTCDay = new Date(itemTimestamp);
    startOfItemUTCDay.setUTCHours(0, 0, 0, 0);

    const startOfItemUTCDayMs = startOfItemUTCDay.getTime();

    if (
      currentDailyTimeframeStartMs === null ||
      startOfItemUTCDayMs !== currentDailyTimeframeStartMs
    ) {
      if (currentDailyGroup.length > 0) {
        groupedData.push(currentDailyGroup);
      }
      currentDailyGroup = [item];
      currentDailyTimeframeStartMs = startOfItemUTCDayMs;
    } else {
      currentDailyGroup.push(item);
    }
  });

  if (currentDailyGroup.length > 0) {
    groupedData.push(currentDailyGroup);
  }

  let dailyXtmChartHistory =
    [] as unknown as XTMHistoryCharts["blocks_found_chart"]["daily"];
  for (const subArr of groupedData) {
    const dayHistory: XTMHistoryCharts["blocks_found_chart"]["daily"][0] = {
      timestamp: subArr.at(0).timestamp.split("T")[0],
      reward: calculateTotalXTM(subArr),
      blocks_found: subArr.length,
    };
    dailyXtmChartHistory.push(dayHistory);
  }

  return dailyXtmChartHistory;
};

const getXtmWeeklyChartHistory = (
  history: XTMMiningHistory[],
): XTMHistoryCharts["blocks_found_chart"]["weekly"] => {
  const getWeekStart = (timestamp: string) => {
    const date = new Date(timestamp);
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
  history.forEach((item) => {
    const weekStart = getWeekStart(item.timestamp);
    if (!grouped[weekStart]) {
      grouped[weekStart] = [];
    }
    grouped[weekStart].push(item);
  });

  let epochAtTheStart = 161;
  const groupedArray = Object.values(grouped) as XTMMiningHistory[][];
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
  return weeklyXtmChartHistory;
};

export const getXtmChartHistory = (
  history: XTMMiningHistory[],
): Pick<XTMHistoryCharts, "blocks_found_chart"> => {
  return {
    blocks_found_chart: {
      daily: getXtmDailyChartHistory(history),
      weekly: getXtmWeeklyChartHistory(history),
    },
  };
};
