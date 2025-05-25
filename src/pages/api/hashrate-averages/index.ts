import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

import type { MiningAverages } from "@/types/MiningStats";
import {
  MONERO_MINING_POOLS_STATS_URL,
  QUBIC_XMR_STATS_URL,
} from "@/utils/constants";

const validMinutes = [
  2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35, 38, 41, 44, 47, 50, 53, 56, 59,
];

async function getAllMoneroMinersStats(prevCount: number) {
  try {
    const dateNow = new Date();

    const minuteToGetIndex =
      validMinutes.findIndex(
        (validMinute) => validMinute > dateNow.getMinutes(),
      ) - prevCount;
    let minute = validMinutes[minuteToGetIndex];

    if (!minute) {
      minute = 59;
      dateNow.setMinutes(0);
      dateNow.setMinutes(dateNow.getMinutes() - 3);
    }

    const apis = [];
    for (let sec = 5; sec <= 40; sec++) {
      dateNow.setMinutes(minute);
      dateNow.setSeconds(sec);
      dateNow.setMilliseconds(0);
      const milliseconds = new Date(dateNow).getTime() / 1000;
      const api = axios.get(MONERO_MINING_POOLS_STATS_URL(milliseconds));
      apis.push(api);
    }
    return apis;
  } catch (e) {
    return null;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MiningAverages>,
) {
  try {
    const apisPrevCountByOne = await getAllMoneroMinersStats(1);
    const apisPrevCountByTwo = await getAllMoneroMinersStats(2);

    const responses = await Promise.any([
      ...apisPrevCountByOne,
      ...apisPrevCountByTwo,
    ]);
    const pools: Record<string, number | string>[] = responses?.data?.data;

    const qubicStatsUrl = QUBIC_XMR_STATS_URL.replace("/stats", "");
    const qubicPool = pools?.find((p) => p.url === qubicStatsUrl);

    if (!qubicPool) {
      throw new Error();
    }

    const response = {
      hashrate_average_7d: qubicPool.hashrate_average_7d as number,
      hashrate_average_1h: qubicPool.hashrate_average_1h as number,
    };
    res.status(200).json(response);
  } catch (e) {
    res.status(400);
  }
}
