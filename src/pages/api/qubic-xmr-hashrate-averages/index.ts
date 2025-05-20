import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

import { MiningAverageStats } from "@/types/MiningStats";
import { QUBIC_XMR_STATS_URL } from "@/utils/constants";

const validMinutes = [
  2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35, 38, 41, 44, 47, 50, 53, 56, 59,
];

async function getAllMoneroMinersStats() {
  try {
    const dateNow = new Date();

    let minuteToGetIndex =
      validMinutes.findIndex(
        (validMinute) => validMinute > dateNow.getMinutes(),
      ) - 1;
    let minute = validMinutes[minuteToGetIndex];

    if (!minute) {
      minute = 59;
      dateNow.setMinutes(0);
      dateNow.setMinutes(dateNow.getMinutes() - 3);
    }

    const apis = [];
    for (let sec = 0; sec <= 60; sec++) {
      dateNow.setMinutes(minute);
      dateNow.setSeconds(sec);
      dateNow.setMilliseconds(0);
      const milliseconds = new Date(dateNow).getTime() / 1000;
      const api = axios.get(
        `https://data.miningpoolstats.stream/data/monero.js?t=${milliseconds}`,
      );
      apis.push(api);
    }

    const response = await Promise.any(apis);
    const pools: any[] = response.data.data;
    return pools;
  } catch (error) {
    return [];
  }
}

export default async function getQubicPoolHashrateAverages(
  req: NextApiRequest,
  res: NextApiResponse<MiningAverageStats>,
) {
  try {
    const pools = await getAllMoneroMinersStats();
    const qubicStatsUrl = QUBIC_XMR_STATS_URL.replace("/stats", "");
    const qubicPool = pools.find((p) => p.url === qubicStatsUrl);
    const response = {
      hashrate_average_7d: qubicPool.hashrate_average_7d,
      hashrate_average_1h: qubicPool.hashrate_average_1h,
    };
    res.status(200).json(response);
  } catch (e) {
    console.log("ERRRROORR");
    res.status(400);
  }
}
