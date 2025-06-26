import { getChartHistory } from "../../../utils/xmr-charts";
import type { NextApiRequest, NextApiResponse } from "next";

import axios from "axios";
import Papa from "papaparse";
import maxBy from "lodash/maxBy";

import getTariMiningStats from "../../../apis/calculated-xtm-stats";
import type {
  CalculatedXMRMiningStats,
  XMRMiningHistory,
} from "@/types/MiningStats";

import { QUBIC_SOLO_MINING_HISTORY } from "@/utils/constants";
import CHECKPOINTS from "@/utils/checkpoints.json";

const getMaxHashrateHistory = (
  history: XMRMiningHistory[],
): XMRMiningHistory => {
  // console.log("latestIndex: ", history.length - 1);
  // console.log(
  //   "latestMaxHashrateIndex: ",
  //   history.findIndex((i) => Number(i.pool_hashrate) === 802856321),
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
    timeout: 12000,
  });
  const historyResponse: XMRMiningHistory[] = await parseCSV(res?.data);
  return historyResponse;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CalculatedXMRMiningStats>,
) {
  try {
    const start = performance.now();

    const xmrHistory = await getXMRMiningHistory();

    const { blocks_found_chart, max_hashrates_chart } =
      await getChartHistory(xmrHistory);

    const maxHashrateHistory = getMaxHashrateHistory(xmrHistory);
    const max_hashrate = Number(maxHashrateHistory.pool_hashrate);
    const max_hashrate_last_update = maxHashrateHistory.timestamp;
    const max_hashrate_last_epoch = Number(maxHashrateHistory.qubic_epoch);

    const end = performance.now();
    console.log("Calculated Mining stats: ", (end - start) / 1000);

    res.setHeader("Cache-Control", "public, max-age=20, s-maxage=40");
    res.setHeader("CDN-Cache-Control", "public, s-maxage=60");
    res.setHeader("Vercel-CDN-Cache-Control", "public, s-maxage=120");

    res.status(200).json({
      max_hashrate_stats: {
        max_hashrate,
        max_hashrate_last_update,
        max_hashrate_last_epoch,
      },
      monero_history_charts: {
        blocks_found_chart,
        max_hashrates_chart,
      },
    });
  } catch (e) {
    console.log("/api/calculated-mining-stats: ", e);
    res.status(401);
  }
}
