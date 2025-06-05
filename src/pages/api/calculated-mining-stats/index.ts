import type { NextApiRequest, NextApiResponse } from "next";

import axios from "axios";
import Papa from "papaparse";
import meanBy from "lodash/meanBy";
import maxBy from "lodash/maxBy";

import CHECKPOINTS from "@/utils/checkpoints.json";

import type {
  CalculatedMiningStats,
  QubicMiningHistory,
} from "@/types/MiningStats";
import { QUBIC_SOLO_MINING_HISTORY } from "@/utils/constants";
import { getPrevious1159AMUTC, getPreviousEpochDateUTC } from "@/utils/date";

export const getBlocksFoundByStartDate = (
  startDateUTC: Date,
  history: QubicMiningHistory[],
): number => {
  let totalDailyBlocks = 0;
  const startDateLocal = new Date(startDateUTC);

  const maxIndex = history.length - 1;
  let index = maxIndex;
  while (index >= 0) {
    const currentDateLocal = new Date(history[index].timestamp.concat("Z"));
    if (startDateLocal < currentDateLocal) {
      index = index - 1;
    } else {
      totalDailyBlocks =
        Number(history[maxIndex].pool_blocks_found) -
        Number(history[index].pool_blocks_found) +
        (Number(history[index].pool_blocks_found) -
          Number(history[index - 1].pool_blocks_found));
      break;
    }
  }
  return totalDailyBlocks;
};

const getOneHourHashrateAverage = (history: QubicMiningHistory[]): number => {
  const maxLength = history.length;
  const oneHrItems = history.slice(maxLength - 600 - 1);
  return meanBy(oneHrItems, (i) => Number(i.pool_hashrate));
};

const getMaxHashrateHistory = (
  history: QubicMiningHistory[],
): QubicMiningHistory => {
  // console.log("latestIndex: ", history.length - 1);
  // console.log("latestMaxHashrateIndex: ", history.findIndex(i => Number(i.pool_hashrate) === 316551877));

  const latestIndex = CHECKPOINTS.MAX_HASHRATE.latestIndex;
  const latestMaxHashrateIndex =
    CHECKPOINTS.MAX_HASHRATE.latestMaxHashrateIndex;

  const maxHashrateHistory = history[latestMaxHashrateIndex];
  const optimizedHistory = history.slice(latestIndex);
  optimizedHistory.push(maxHashrateHistory);

  return maxBy(optimizedHistory, (i) => Number(i.pool_hashrate));
};

const parseCSV = async (stream) => {
  return await new Promise<any[]>((resolve, reject) => {
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

export const getMiningHistory = async () => {
  const res = await axios.get(QUBIC_SOLO_MINING_HISTORY, {
    responseType: "stream",
    timeout: 7000,
  });
  const historyResponse: QubicMiningHistory[] = await parseCSV(res?.data);
  return historyResponse;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CalculatedMiningStats>,
) {
  try {
    const history = await getMiningHistory();

    const epoch = Number(history.at(-1).qubic_epoch);

    const maxHashrateHistory = getMaxHashrateHistory(history);
    const max_hashrate = Number(maxHashrateHistory.pool_hashrate);
    const max_hashrate_last_update = maxHashrateHistory.timestamp;
    const max_hashrate_last_epoch = Number(maxHashrateHistory.qubic_epoch);

    const hashrate_average_1h = getOneHourHashrateAverage(history);

    const epoch_blocks_found = getBlocksFoundByStartDate(
      getPreviousEpochDateUTC(),
      history,
    );

    const daily_blocks_found = getBlocksFoundByStartDate(
      getPrevious1159AMUTC(),
      history,
    );

    if (process.env.NODE_ENV === "production") {
      res.setHeader("Cache-Control", "public, max-age=90");
      res.setHeader("CDN-Cache-Control", "public, max-age=120");
      res.setHeader("Vercel-CDN-Cache-Control", "public, max-age=180");
    } else {
      console.log("No caching /api/calculated-mining-stats");
      res.setHeader(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, proxy-revalidate",
      );
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
      res.setHeader("Surrogate-Control", "no-store");
    }

    res.status(200).json({
      hashrate_average_1h,
      daily_blocks_found,
      epoch_blocks_found,
      epoch,
      max_hashrate,
      max_hashrate_last_update,
      max_hashrate_last_epoch,
    });
  } catch (e) {
    res.status(400);
  }
}
