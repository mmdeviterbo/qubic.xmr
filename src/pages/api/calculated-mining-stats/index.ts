import { getChartHistory } from "../../../utils/xmr-charts";
import type { NextApiRequest, NextApiResponse } from "next";

import axios from "axios";
import Papa from "papaparse";
// import meanBy from "lodash/meanBy";
import maxBy from "lodash/maxBy";

import CHECKPOINTS from "@/utils/checkpoints.json";

import type {
  CalculatedMiningStats,
  XMRMiningHistory,
  XTMMiningHistory,
} from "@/types/MiningStats";
import { QUBIC_SOLO_MINING_HISTORY } from "@/utils/constants";

const getMaxHashrateHistory = (
  history: XMRMiningHistory[],
): XMRMiningHistory => {
  // console.log("latestIndex: ", history.length - 1);
  // console.log(
  //   "latestMaxHashrateIndex: ",
  //   history.findIndex((i) => Number(i.pool_hashrate) === 438803704),
  // );

  const latestIndex = CHECKPOINTS.MAX_HASHRATE.latestIndex;
  const latestMaxHashrateIndex =
    CHECKPOINTS.MAX_HASHRATE.latestMaxHashrateIndex;

  const maxHashrateHistory = history[latestMaxHashrateIndex];
  const optimizedHistory = history.slice(latestIndex);
  optimizedHistory.push(maxHashrateHistory);

  return maxBy(optimizedHistory, (i) => Number(i.pool_hashrate));
};

const parseCSV = async (stream) => {
  return new Promise<any[]>((resolve, reject) => {
    let parsedData = [];
    Papa.parse(stream, {
      header: true,
      step: function (result) {
        parsedData.push(result.data);
      },
      complete: function () {
        resolve(parsedData);
      },
      error: function (error) {
        reject(error);
      },
    });
  });
};

export const getXMRMiningHistory = async () => {
  const res = await axios.get(QUBIC_SOLO_MINING_HISTORY, {
    responseType: "stream",
    timeout: 10000,
  });
  const historyResponse: XMRMiningHistory[] = await parseCSV(res?.data);
  return historyResponse;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CalculatedMiningStats>,
) {
  try {
    const xmrHistory = await getXMRMiningHistory();

    const epoch = Number(xmrHistory.at(-1).qubic_epoch);

    const { blocks_found_chart, max_hashrates_chart } =
      getChartHistory(xmrHistory);

    const maxHashrateHistory = getMaxHashrateHistory(xmrHistory);
    const max_hashrate = Number(maxHashrateHistory.pool_hashrate);
    const max_hashrate_last_update = maxHashrateHistory.timestamp;
    const max_hashrate_last_epoch = Number(maxHashrateHistory.qubic_epoch);

    const { weekly: weeklyChart, daily: dailyChart } = blocks_found_chart;
    const epoch_blocks_found = weeklyChart.at(-1).blocks_found;
    const daily_blocks_found = dailyChart.at(-1).blocks_found;

    res.setHeader("Cache-Control", "public, max-age=120, s-maxage=180");
    res.setHeader("CDN-Cache-Control", "public, s-maxage=270");
    res.setHeader("Vercel-CDN-Cache-Control", "public, s-maxage=360");

    res.status(200).json({
      daily_blocks_found,
      epoch_blocks_found,
      epoch,
      max_hashrate,
      max_hashrate_last_update,
      max_hashrate_last_epoch,
      historyCharts: {
        blocks_found_chart,
        max_hashrates_chart,
      },
    });
  } catch (e) {
    res.status(400);
  }
}
